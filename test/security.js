/* global describe, before, after, beforeEach, it, context */

var expect = require('chai').expect
var popsicle = require('popsicle')
var router = require('osprey-router')
var join = require('path').join
var parser = require('raml-1-parser')
var ClientOAuth2 = require('client-oauth2')
var serverAddress = require('server-address')
var auth = require('popsicle-basic-auth')
var utils = require('./support/utils')
var osprey = require('../')
var securityHandler = require('../lib/security/handler')
var securityScope = require('../lib/security/scope')

var SECURITY_RAML_PATH = join(__dirname, 'fixtures/security.raml')

describe('security', function () {
  var server
  var oauth2Apps = {
    'abc': {
      id: 'abc',
      secret: '123'
    }
  }
  var users = {
    'blakeembrey': {
      username: 'blakeembrey',
      password: 'hunter2'
    }
  }
  var localOAuth2
  var token = uid()
  var altToken = uid()
  var refreshToken = uid()
  var code = uid()
  var loggedIn

  // Set up the server on each render.
  before(function () {
    return parser.loadRAML(SECURITY_RAML_PATH)
      .then(function (ramlApi) {
        var raml = ramlApi.toJSON({
          serializeMetadata: false
        })
        var app = router()

        app.use(osprey.security(raml, {
          oauth_2_0: {
            authenticateClient: function (clientId, clientSecret, done) {
              var client = oauth2Apps[clientId]

              if (client.secret !== clientSecret) {
                return done(null, false)
              }

              return done(null, client)
            },
            findUserByToken: function (userToken, done) {
              if (userToken === token) {
                return done(null, users.blakeembrey, { scope: 'profile' })
              }

              // Invalid scope use-case.
              if (userToken === altToken) {
                return done(null, {}, { scope: 'foo' })
              }

              return done()
            },
            sessionKeys: ['a', 'b', 'c'],
            serializeClient: function (application, done) {
              return done(null, application.id)
            },
            deserializeClient: function (id, done) {
              return done(null, oauth2Apps[id])
            },
            serveAuthorizationPage: function (req, res) {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                scope: req.oauth2.req.scope,
                transaction_id: req.oauth2.transactionID
              }))
            },
            immediateAuthorization: function (client, user, scope, done) {
              return done(null, loggedIn)
            },
            authorizeClient: function (clientId, redirectUri, scope, type, done) {
              if (oauth2Apps.hasOwnProperty(clientId)) {
                return done(null, oauth2Apps[clientId], redirectUri)
              }

              return done()
            },
            ensureLoggedIn: function (req, res, next) {
              req.user = users.blakeembrey

              return next() // Assume logged in.
            },
            grant: {
              code: function (client, redirectUri, user, ares, done) {
                loggedIn = true

                return done(null, code)
              },
              token: function (client, user, ares, done) {
                loggedIn = true

                return done(null, token)
              }
            },
            exchange: {
              credentials: function (client, scope, done) {
                return done(null, token, refreshToken, { expires_in: 3600 })
              },
              owner: function (client, username, password, scope, done) {
                if (users[username] && users[username].password === password) {
                  return done(null, token)
                }

                return done(null, false)
              },
              code: function (client, code, redirectUri, done) {
                return done(null, token)
              },
              refresh: function (client, refreshToken, scope, done) {
                return done(null, altToken)
              }
            }
          },
          basic_auth: {
            validateUser: function (username, password, done) {
              if (users[username] && users[username].password === password) {
                return done(null, true)
              }

              return done(null, false)
            }
          },
          custom_auth: function () {
            var count = 0

            function rejectOddRoute (req, res, next) {
              if (count++ % 2 === 0) {
                return next()
              }

              var err = new Error('Wrong number. Try again.')
              err.status = 401
              return next(err)
            }

            return {
              handler: function () {
                return rejectOddRoute
              }
            }
          }
        }))

        var helloWorld = utils.response('hello, world')

        app.get('/default', helloWorld)
        app.get('/unsecured', helloWorld)
        app.get('/secured/oauth2', helloWorld)
        app.get('/secured/oauth2/scoped', helloWorld)
        app.get('/secured/basic', helloWorld)
        app.get('/secured/custom', helloWorld)
        app.get('/secured/combined', helloWorld)
        app.get('/secured/combined/unauthed', helloWorld)

        server = serverAddress(utils.createServer(app))
        server.listen()

        localOAuth2 = new ClientOAuth2({
          clientId: 'abc',
          clientSecret: '123',
          accessTokenUri: server.url('/oauth/token'),
          authorizationUri: server.url('/oauth/authorize'),
          scopes: ['profile'],
          redirectUri: server.url('/callback')
        })
      })
  })

  after(function () {
    server.close()
  })

  beforeEach(function () {
    loggedIn = false
  })

  it('should use global securedBy when not defined', function () {
    return popsicle.default(server.url('/default'))
      .then(expectStatus(401))
  })

  describe('Basic Authentication', function () {
    it('should block access', function () {
      return popsicle.default(server.url('/secured/basic'))
        .then(expectStatus(401))
    })

    it('should allow access with basic authentication', function () {
      return popsicle.default(server.url('/secured/basic'))
        .use(auth('blakeembrey', 'hunter2'))
        .then(expectHelloWorld)
    })

    it('should reject invalid credentials', function () {
      return popsicle.default(server.url('/secured/basic'))
        .use(auth('blakeembrey', 'wrongpassword'))
        .then(expectStatus(401))
    })
  })

  describe('OAuth 2.0', function () {
    it('should protect endpoints', function () {
      return popsicle.default(server.url('/secured/oauth2'))
        .then(expectStatus(401))
    })

    it('should not protect undefined endpoints', function () {
      return popsicle.default(server.url('/unsecured'))
        .then(expectHelloWorld)
    })

    describe('oauth2 grant types', function () {
      describe('credentials', function () {
        it('should authenticate', function () {
          return localOAuth2.credentials.getToken()
            .then(function (user) {
              return user.request({ url: server.url('/secured/oauth2') })
            })
            .then(expectHelloWorld)
        })

        it('should reject invalid clients', function () {
          return localOAuth2.credentials.getToken({ clientSecret: 'wrong' })
            .catch(expectStatus(401))
        })

        it('should reject invalid scopes', function () {
          return localOAuth2.credentials.getToken({ scopes: ['wrong'] })
            .catch(expectStatus(400))
        })
      })

      describe('owner', function () {
        it('should authenticate', function () {
          return localOAuth2.owner.getToken('blakeembrey', 'hunter2')
            .then(function (user) {
              return user.request({ url: server.url('/secured/oauth2') })
            })
            .then(expectHelloWorld)
        })

        it('should reject invalid owner credentials', function () {
          return localOAuth2.owner.getToken('blakeembrey', 'foobar')
            .catch(expectStatus(403))
        })
      })

      describe('code', function () {
        it('should authenticate', function () {
          var url = localOAuth2.code.getUri()
          var jar = popsicle.jar()

          return popsicle.default({
            url: url,
            options: {
              jar: jar
            }
          })
            .then(function (res) {
              return popsicle.post({
                url: url,
                body: res.body,
                options: {
                  jar: jar,
                  followRedirects: false
                }
              })
            })
            .then(function (res) {
              expect(res.status).to.equal(302)

              return localOAuth2.code.getToken(res.get('Location'))
            })
            .then(function (user) {
              return user.request({ url: server.url('/secured/oauth2') })
            })
            .then(expectHelloWorld)
            // Subsequent authorizations should happen automatically.
            .then(function () {
              return popsicle.default({
                url: url,
                options: {
                  jar: jar,
                  followRedirects: false
                }
              })
            })
            .then(function (res) {
              expect(res.status).to.equal(302)
              expect(res.get('Location')).to.be.a('string')
            })
        })
      })

      describe('token', function () {
        it('should authenticate', function () {
          var url = localOAuth2.token.getUri()
          var jar = popsicle.jar()

          return popsicle.default({
            url: url,
            options: {
              jar: jar
            }
          })
            .then(function (res) {
              return popsicle.post({
                url: url,
                body: res.body,
                options: {
                  jar: jar,
                  followRedirects: false
                }
              })
            })
            .then(function (res) {
              expect(res.status).to.equal(302)

              return localOAuth2.token.getToken(res.get('Location'))
            })
            .then(function (user) {
              return user.request({ url: server.url('/secured/oauth2') })
            })
            .then(expectHelloWorld)
        })
      })

      describe('refresh token', function () {
        it('should exchange token', function () {
          return localOAuth2.credentials.getToken()
            .then(function (user) {
              expect(user.accessToken).to.equal(token)

              return user.refresh()
            })
            .then(function (user) {
              expect(user.accessToken).to.equal(altToken)
            })
        })
      })
    })

    describe('scopes', function () {
      it('should authorize valid scopes', function () {
        var user = localOAuth2.createToken(token, { token_type: 'bearer' })

        return user.request({ url: server.url('/secured/oauth2/scoped') })
          .then(expectHelloWorld)
      })

      it('should reject invalid scopes', function () {
        var user = localOAuth2.createToken(altToken, { token_type: 'bearer' })

        return user.request({ url: server.url('/secured/oauth2/scoped') })
          .then(expectStatus(400))
      })
    })
  })

  describe('Custom Authentication', function () {
    it('should accept a request', function () {
      return popsicle.default(server.url('/secured/custom'))
        .then(expectHelloWorld)
    })

    it('should reject a request', function () {
      return popsicle.default(server.url('/secured/custom'))
        .then(expectStatus(401))
    })
  })

  describe('combined', function () {
    it('should allow access', function () {
      return popsicle.default(server.url('/secured/combined'))
        .use(auth('blakeembrey', 'hunter2'))
        .then(expectHelloWorld)
    })

    it('should allow access with anonymous', function () {
      return popsicle.default(server.url('/secured/combined/unauthed'))
        .then(expectHelloWorld)
    })
  })
})

describe('lib.security.handler.createHandler', function () {
  context('when handle function for custom type is not provided', function () {
    it('should throw an error', function () {
      try {
        securityHandler({'type': 'Foo'}, null, null)
      } catch (error) {
        expect(error).to.not.be.null
        expect(error.message).to.contain(
          'To enable Foo, you must provide a function')
      }
    })
  })
})

describe('lib.security.scope.enforceScope', function () {
  context('when empty scope is passed', function () {
    it('should throw an error', function () {
      try {
        securityScope([])
      } catch (error) {
        expect(error).to.not.be.null
        expect(error.message).to.contain(
          'Expected a scope or array of scopes')
      }
    })
  })
})

function expectHelloWorld (res) {
  expect(res.body).to.equal('hello, world')
  expect(res.status).to.equal(200)
}

function expectStatus (status) {
  return function (res) {
    expect(res.status).to.equal(status)
  }
}

function uid () {
  return Math.random().toString(36).substr(2)
}

/* global describe, before, after, beforeEach, it, context */

const expect = require('chai').expect
const router = require('osprey-router')
const path = require('path')
const ClientOAuth2 = require('client-oauth2')
const ServerAddress = require('server-address').ServerAddress
const wap = require('webapi-parser').WebApiParser

const utils = require('./support/utils')
const auth = utils.basicAuth
const osprey = require('../')
const securityHandler = require('../lib/security/handler')
const securityScope = require('../lib/security/scope')

const SECURITY_RAML_PATH = path.join(__dirname, 'fixtures/security.raml')

describe('security', function () {
  let server
  const oauth2Apps = {
    abc: {
      id: 'abc',
      secret: '123'
    }
  }
  const users = {
    blakeembrey: {
      username: 'blakeembrey',
      password: 'hunter2'
    },
    bob: {
      username: 'bob',
      password: 'secret'
    }
  }
  let localOAuth2
  const token = uid()
  const altToken = uid()
  const refreshToken = uid()
  const code = uid()
  let loggedIn

  // Set up the server on each render.
  before(async function () {
    const model = await wap.raml10.parse(`file://${SECURITY_RAML_PATH}`)
    const resolved = await wap.raml10.resolve(model)
    const app = router()

    app.use(osprey.security(resolved, {
      oauth_2_0: {
        authenticateClient: function (clientId, clientSecret, done) {
          const client = oauth2Apps[clientId]

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
          if (Object.prototype.hasOwnProperty.call(oauth2Apps, clientId)) {
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
      digest_auth: {
        findUserByUsername: function (username, done) {
          const user = users[username]
          if (user) {
            return done(null, user, user.password)
          }

          return done(null, false)
        },
        realm: 'Users'
      },
      custom_auth: function () {
        let count = 0

        function rejectOddRoute (req, res, next) {
          if (count++ % 2 === 0) {
            return next()
          }

          const err = new Error('Wrong number. Try again.')
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

    const helloWorld = utils.response('hello, world')

    app.get('/default', helloWorld)
    app.get('/unsecured', helloWorld)
    app.get('/secured/oauth2', helloWorld)
    app.get('/secured/oauth2/scoped', helloWorld)
    app.get('/secured/basic', helloWorld)
    app.get('/secured/digest', helloWorld)
    app.get('/secured/custom', helloWorld)
    app.get('/secured/combined', helloWorld)
    app.get('/secured/combined/unauthed', helloWorld)

    server = new ServerAddress(utils.createServer(app))
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

  after(function () {
    server.close()
  })

  beforeEach(function () {
    loggedIn = false
  })

  it('should use global securedBy when not defined', function () {
    return utils.makeFetcher()
      .fetch(server.url('/default'), { method: 'GET' })
      .then(expectStatus(401))
  })

  describe('Basic Authentication', function () {
    it('should block access', function () {
      return utils.makeFetcher()
        .fetch(server.url('/secured/basic'), { method: 'GET' })
        .then(expectStatus(401))
    })

    it('should allow access with basic authentication', function () {
      return utils.makeFetcher(auth('blakeembrey', 'hunter2'))
        .fetch(server.url('/secured/basic'), { method: 'GET' })
        .then(expectHelloWorld)
    })

    it('should reject invalid credentials', function () {
      return utils.makeFetcher(auth('blakeembrey', 'wrongpassword'))
        .fetch(server.url('/secured/basic'), { method: 'GET' })
        .then(expectStatus(401))
    })
  })

  describe('Digest Authentication', function () {
    function simpleDigestAuth (username) {
      // This header has 'response' encoded for username 'bob'
      // and password 'secret'
      const header = 'Digest username="' + username + '", ' +
        'realm="Users", nonce="ImAnAwesomeNonce", uri="/secured/digest", ' +
        'response="ba7687213adfa6ccddda9dc247030232"'
      return function (req, next) {
        req.headers.set('Authorization', header)
        return next()
      }
    }

    it('should block not authenticated access', function () {
      return utils.makeFetcher()
        .fetch(server.url('/secured/digest'), { method: 'GET' })
        .then(expectStatus(401))
    })

    it('should allow access with digest authentication', function () {
      return utils.makeFetcher(simpleDigestAuth('bob'))
        .fetch(server.url('/secured/digest'), { method: 'GET' })
        .then(expectHelloWorld)
    })

    it('should reject access with invalid credentials', function () {
      return utils.makeFetcher(simpleDigestAuth('jake'))
        .fetch(server.url('/secured/digest'), { method: 'GET' })
        .then(expectStatus(401))
    })
  })

  describe('OAuth 2.0', function () {
    it('should protect endpoints', function () {
      return utils.makeFetcher()
        .fetch(server.url('/secured/oauth2'), { method: 'GET' })
        .then(expectStatus(401))
    })

    it('should not protect undefined endpoints', function () {
      return utils.makeFetcher()
        .fetch(server.url('/unsecured'), { method: 'GET' })
        .then(expectHelloWorld)
    })

    describe('oauth2 grant types', function () {
      describe('credentials', function () {
        it('should authenticate', function () {
          return localOAuth2.credentials.getToken()
            .then(function (user) {
              const req = user.sign({
                url: server.url('/secured/oauth2'),
                method: 'GET'
              })
              return utils.makeFetcher().fetch(req.url, req)
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
              const req = user.sign({
                url: server.url('/secured/oauth2'),
                method: 'GET'
              })
              return utils.makeFetcher().fetch(req.url, req)
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
          const url = localOAuth2.code.getUri()
          expect(url).to.not.contain(localOAuth2.options.redirectUri)

          const fetcher = utils.makeFetcher()
          return fetcher.fetch(url, {
            method: 'GET'
          })
            .then(function (res) {
              return fetcher.fetch(url, {
                method: 'POST',
                body: res.body,
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            })
            .then(function (res) {
              expect(res.url).to.contain(localOAuth2.options.redirectUri)
              return localOAuth2.code.getToken(res.url)
            })
            .then(function (user) {
              const req = user.sign({
                url: server.url('/secured/oauth2'),
                method: 'GET'
              })
              return fetcher.fetch(req.url, req)
            })
            .then(expectHelloWorld)
            // Subsequent authorizations should happen automatically.
            .then(function () {
              return fetcher.fetch(url, {
                method: 'GET'
              })
            })
            .then(function (res) {
              expect(res.url).to.contain(localOAuth2.options.redirectUri)
            })
        })
      })

      describe('token', function () {
        it('should authenticate', function () {
          const url = localOAuth2.token.getUri()
          expect(url).to.not.contain(localOAuth2.options.redirectUri)

          const fetcher = utils.makeFetcher()

          return fetcher.fetch(url, {
            method: 'GET'
          })
            .then(function (res) {
              return fetcher.fetch(url, {
                method: 'POST',
                body: res.body,
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            })
            .then(function (res) {
              expect(res.url).to.contain(localOAuth2.options.redirectUri)
              return localOAuth2.token.getToken(res.url)
            })
            .then(function (user) {
              const req = user.sign({
                url: server.url('/secured/oauth2'),
                method: 'GET'
              })
              return fetcher.fetch(req.url, req)
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
        const user = localOAuth2.createToken(token, { token_type: 'bearer' })
        const req = user.sign({
          url: server.url('/secured/oauth2/scoped'),
          method: 'GET'
        })
        return utils.makeFetcher().fetch(req.url, req)
          .then(expectHelloWorld)
      })

      it('should reject invalid scopes', function () {
        const user = localOAuth2.createToken(altToken, { token_type: 'bearer' })
        const req = user.sign({
          url: server.url('/secured/oauth2/scoped'),
          method: 'GET'
        })
        return utils.makeFetcher().fetch(req.url, req)
          .then(expectStatus(400))
      })
    })
  })

  describe('Custom Authentication', function () {
    it('should accept a request', function () {
      return utils.makeFetcher()
        .fetch(server.url('/secured/custom'), { method: 'GET' })
        .then(expectHelloWorld)
    })

    it('should reject a request', function () {
      return utils.makeFetcher()
        .fetch(server.url('/secured/custom'), { method: 'GET' })
        .then(expectStatus(401))
    })
  })

  describe('combined', function () {
    it('should allow access', function () {
      return utils.makeFetcher(auth('blakeembrey', 'hunter2'))
        .fetch(server.url('/secured/combined'), { method: 'GET' })
        .then(expectHelloWorld)
    })

    it('should allow access with anonymous', function () {
      return utils.makeFetcher()
        .fetch(server.url('/secured/combined/unauthed'), { method: 'GET' })
        .then(expectHelloWorld)
    })
  })
})

describe('lib.security.handler.createHandler', function () {
  context('when handle function for custom type is not provided', function () {
    it('should throw an error', function () {
      const scheme = { type: { value: () => 'Foo' } }
      try {
        securityHandler(scheme, null, null)
      } catch (error) {
        expect(error).to.not.equal(null)
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
        expect(error).to.not.equal(null)
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

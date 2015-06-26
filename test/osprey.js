/* global describe, beforeEach, afterEach, it */

/* istanbul ignore next */
if (!global.Promise) {
  require('es6-promise').polyfill()
}

var expect = require('chai').expect
var popsicle = require('popsicle')
var server = require('popsicle-server')
var router = require('osprey-router')
var join = require('path').join
var finalhandler = require('finalhandler')
var bodyParser = require('body-parser')
var serverAddress = require('server-address')
var Busboy = require('busboy')
var parser = require('raml-parser')
var osprey = require('../')

var EXAMPLE_RAML_PATH = join(__dirname, 'fixtures/example.raml')

describe('osprey', function () {
  describe('server middleware', function () {
    var app

    beforeEach(function () {
      app = router()

      return parser.loadFile(EXAMPLE_RAML_PATH)
        .then(function (raml) {
          app.use(osprey.createServer(raml))

          app.get('/users', success)
          app.get('/unknown', success)
        })
    })

    it('should accept defined routes', function () {
      return popsicle('/users')
        .use(server(createServer(app)))
        .then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.status).to.equal(200)
        })
    })

    it('should reject undefined routes', function () {
      return popsicle('/unknown')
        .use(server(createServer(app)))
        .then(function (res) {
          expect(res.status).to.equal(404)
        })
    })
  })

  describe('proxy', function () {
    var app
    var proxy
    var server

    beforeEach(function () {
      app = router()
      server = serverAddress(createServer(app))

      server.listen()

      return parser.loadFile(EXAMPLE_RAML_PATH)
        .then(function (raml) {
          var ospreyApp = osprey.createServer(raml)
          var proxyApp = osprey.createProxy(ospreyApp, server.url())

          proxy = serverAddress(proxyApp)
          proxy.listen()
        })
    })

    afterEach(function () {
      proxy.close()
      server.close()
    })

    describe('routes', function () {
      it('should proxy defined routes', function () {
        app.get('/users', success)

        return popsicle(proxy.url('/users'))
          .then(function (res) {
            expect(res.body).to.equal('success')
            expect(res.status).to.equal(200)
          })
      })

      it('should block undefined routes', function () {
        app.get('/unknown', success)

        return popsicle(proxy.url('/unknown'))
          .then(function (res) {
            expect(res.status).to.equal(404)
          })
      })
    })

    describe('query parameters', function () {
      it('should filter unknown query parameters', function () {
        app.get('/query', function (req, res, next) {
          expect(req.url).to.equal('/query?hello=world')

          return next()
        }, success)

        return popsicle(proxy.url('/query?hello=world&test=true'))
          .then(function (res) {
            expect(res.body).to.equal('success')
            expect(res.status).to.equal(200)
          })
      })

      it('should reject invalid query parameters', function () {
        return popsicle(proxy.url('/query?hello=12345'))
          .then(function (res) {
            expect(res.status).to.equal(400)
          })
      })
    })

    describe('body', function () {
      describe('json', function () {
        it('should proxy valid json', function () {
          app.post(
            '/json',
            bodyParser.json(),
            function middleware (req, res, next) {
              expect(req.body).to.deep.equal({ hello: 'world' })

              return next()
            },
            success
          )

          return popsicle({
            url: proxy.url('/json'),
            method: 'post',
            body: {
              hello: 'world'
            }
          })
            .then(function (res) {
              expect(res.body).to.equal('success')
              expect(res.status).to.equal(200)
            })
        })

        it('should reject invalid json', function () {
          var run = false

          app.post('/json', function (req, res, next) {
            run = true

            return next()
          }, success)

          return popsicle({
            url: proxy.url('/json'),
            method: 'post',
            body: {
              hello: 12345
            }
          })
            .then(function (res) {
              expect(run).to.be.false
              expect(res.status).to.equal(400)
            })
        })
      })

      describe('urlencoded', function () {
        it('should proxy valid urlencoded strings', function () {
          app.post(
            '/urlencoded',
            bodyParser.urlencoded({ extended: false }),
            function middleware (req, res, next) {
              expect(req.body).to.deep.equal({ hello: 'world' })

              return next()
            },
            success
          )

          return popsicle({
            url: proxy.url('/urlencoded'),
            method: 'post',
            body: {
              hello: 'world'
            },
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          })
            .then(function (res) {
              expect(res.body).to.equal('success')
              expect(res.status).to.equal(200)
            })
        })

        it('should reject invalid urlencoded string values', function () {
          var run = false

          app.post('/urlencoded', function (req, res, next) {
            run = true

            return next()
          }, success)

          return popsicle({
            url: proxy.url('/urlencoded'),
            method: 'post',
            body: {
              hello: 12345
            },
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          })
            .then(function (res) {
              expect(run).to.be.false
              expect(res.status).to.equal(400)
            })
        })
      })

      describe('form data', function () {
        it('should proxy valid form data', function () {
          app.post(
            '/formdata',
            function middleware (req, res, next) {
              var busboy = new Busboy({ headers: req.headers })

              var fieldname
              var fieldvalue

              busboy.on('field', function (name, value) {
                fieldname = name
                fieldvalue = value
              })

              busboy.on('finish', function () {
                expect(fieldname).to.equal('hello')
                expect(fieldvalue).to.equal('world')

                return next()
              })

              return req.pipe(busboy)
            },
            success
          )

          return popsicle({
            url: proxy.url('/formdata'),
            method: 'post',
            body: {
              hello: 'world'
            },
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
            .then(function (res) {
              expect(res.body).to.equal('success')
              expect(res.status).to.equal(200)
            })
        })

        it('should reject invalid form data', function () {
          var run = false

          app.post('/formdata', function (req, res, next) {
            run = true

            return next()
          }, success)

          return popsicle({
            url: proxy.url('/formdata'),
            method: 'post',
            body: {
              hello: 12345
            },
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
            .then(function (res) {
              expect(run).to.be.false
              expect(res.status).to.equal(400)
            })
        })
      })
    })
  })

  describe.skip('documentation', function () {
    var app

    beforeEach(function () {
      app = router()

      return parser.loadFile(EXAMPLE_RAML_PATH)
        .then(function (raml) {
          app.use(osprey.createServer(raml, {
            documentationPath: '/docs'
          }))

          app.get('/users', success)
          app.get('/unknown', success)
        })
    })

    it('should serve html documentation', function () {
      return popsicle('/docs')
        .use(server(createServer(app)))
        .then(function (res) {
          expect(res.body).to.match(/^<!doctype html>/i)
          expect(res.status).to.equal(200)
          expect(res.type()).to.equal('text/html')
        })
    })
  })
})

function createServer (router) {
  return function (req, res) {
    return router(req, res, finalhandler(req, res))
  }
}

function success (req, res) {
  res.end('success')
}

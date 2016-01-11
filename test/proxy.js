/* global describe, before, after, it */

var expect = require('chai').expect
var popsicle = require('popsicle')
var router = require('osprey-router')
var join = require('path').join
var bodyParser = require('body-parser')
var serverAddress = require('server-address')
var Busboy = require('busboy')
var parser = require('raml-parser')
var osprey = require('../')
var utils = require('./support/utils')

var EXAMPLE_RAML_PATH = join(__dirname, 'fixtures/example.raml')

var success = utils.response('success')

describe('proxy', function () {
  var app
  var proxy
  var server

  before(function () {
    app = router()
    server = serverAddress(utils.createServer(app))

    server.listen()

    return parser.loadFile(EXAMPLE_RAML_PATH)
      .then(function (raml) {
        var ospreyApp = osprey.server(raml)
        var proxyApp = osprey.proxy(ospreyApp, server.url())

        proxy = serverAddress(proxyApp)
        proxy.listen()
      })
  })

  after(function () {
    proxy.close()
    server.close()
  })

  describe('routes', function () {
    it('should proxy defined routes', function () {
      app.get('/users', success)

      return popsicle.default(proxy.url('/users'))
        .then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.status).to.equal(200)
        })
    })

    it('should block undefined routes', function () {
      app.get('/unknown', success)

      return popsicle.default(proxy.url('/unknown'))
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

      return popsicle.default(proxy.url('/query?hello=world&test=true'))
        .then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.status).to.equal(200)
        })
    })

    it('should reject invalid query parameters', function () {
      return popsicle.default(proxy.url('/query?hello=12345'))
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

        return popsicle.default({
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

        return popsicle.default({
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

        return popsicle.default({
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

        return popsicle.default({
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

        return popsicle.default({
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

        return popsicle.default({
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

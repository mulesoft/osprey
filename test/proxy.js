/* global describe, before, after, it */

var expect = require('chai').expect
var router = require('osprey-router')
var join = require('path').join
var bodyParser = require('body-parser')
var serverAddress = require('server-address')
var Busboy = require('busboy')
var parser = require('raml-1-parser')
var osprey = require('../')
var utils = require('./support/utils')
var FormData = require('form-data')
var querystring = require('querystring')

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

    return parser.loadRAML(EXAMPLE_RAML_PATH)
      .then(function (ramlApi) {
        var raml = ramlApi.toJSON({
          serializeMetadata: false
        })
        var ospreyApp = osprey.server(raml, { RAMLVersion: ramlApi.RAMLVersion() })
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

      return utils.makeFetcher().fetch(proxy.url('/users'), {
        method: 'GET'
      })
        .then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.status).to.equal(200)
        })
    })

    it('should block undefined routes', function () {
      app.get('/unknown', success)

      return utils.makeFetcher().fetch(proxy.url('/unknown'), {
        method: 'GET'
      })
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

      return utils.makeFetcher().fetch(proxy.url('/query?hello=world&test=true'), {
        method: 'GET'
      })
        .then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.status).to.equal(200)
        })
    })

    it('should reject invalid query parameters', function () {
      return utils.makeFetcher().fetch(proxy.url('/query?hello=12345'), {
        method: 'GET'
      })
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

        return utils.makeFetcher().fetch(proxy.url('/json'), {
          method: 'POST',
          body: JSON.stringify({
            hello: 'world'
          }),
          headers: { 'Content-Type': 'application/json' }
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

        return utils.makeFetcher().fetch(proxy.url('/json'), {
          method: 'POST',
          body: JSON.stringify({
            hello: 12345
          }),
          headers: { 'Content-Type': 'application/json' }
        })
          .then(function (res) {
            expect(run).to.equal(false)
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

        return utils.makeFetcher().fetch(proxy.url('/urlencoded'), {
          method: 'POST',
          body: querystring.encode({ hello: 'world' }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
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

        return utils.makeFetcher().fetch(proxy.url('/urlencoded'), {
          method: 'POST',
          body: querystring.encode({ hello: 12345 }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then(function (res) {
            expect(res.status).to.equal(400)
            expect(run).to.equal(false)
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

        var form = new FormData()
        form.append('hello', 'world')

        return utils.makeFetcher().fetch(proxy.url('/formdata'), {
          method: 'POST',
          body: form,
          headers: form.getHeaders()
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

        var form = new FormData()
        form.append('hello', 12345)

        return utils.makeFetcher().fetch(proxy.url('/formdata'), {
          method: 'POST',
          body: form,
          headers: form.getHeaders()
        })
          .then(function (res) {
            expect(run).to.equal(false)
            expect(res.status).to.equal(400)
          })
      })
    })
  })
})

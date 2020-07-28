/* global describe, beforeEach, it */

const expect = require('chai').expect
const ospreyRouter = require('osprey-router')
const path = require('path')
const popsicleServer = require('popsicle-server').server

const osprey = require('../')
const utils = require('./support/utils')
const success = utils.response('success')
const auth = utils.basicAuth

const EXAMPLE_RAML_PATH = path.join(__dirname, 'fixtures/example.raml')

describe('server', function () {
  let http

  describe('normal usage', function () {
    beforeEach(function () {
      return osprey.loadFile(EXAMPLE_RAML_PATH, { server: { cors: true, compression: true } })
        .then(function (middleware) {
          const app = ospreyRouter()
          app.use(middleware)
          app.get('/users', success)
          app.get('/unknown', success)
          http = utils.createServer(app)
        })
    })

    it('should accept defined routes', function () {
      return utils.makeFetcher(popsicleServer(http))
        .fetch('/users', { method: 'GET' })
        .then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.status).to.equal(200)
        })
    })

    it('should reject undefined routes', function () {
      return utils.makeFetcher(popsicleServer(http))
        .fetch('/unknown', { method: 'GET' })
        .then(function (res) {
          expect(res.status).to.equal(404)
        })
    })

    it('should have cors enabled', function () {
      return utils.makeFetcher(popsicleServer(http))
        .fetch('/users', { method: 'OPTIONS' })
        .then(function (res) {
          expect(res.status).to.equal(204)
          expect(res.headers.get('access-control-allow-origin')).to.equal('*')
          expect(res.headers.get('access-control-allow-methods')).to.equal('GET,HEAD,PUT,PATCH,POST,DELETE')
        })
    })

    it('should have compression enabled', function () {
      return utils.makeFetcher(popsicleServer(http))
        .fetch('/users', { method: 'GET' })
        .then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.headers.get('content-encoding')).to.equal('gzip')
        })
    })
  })

  describe('not found handler', function () {
    beforeEach(function () {
      return osprey.loadFile(EXAMPLE_RAML_PATH, { server: { notFoundHandler: false } })
        .then(function (middleware) {
          const app = ospreyRouter()
          app.use(middleware)
          app.get('/definitelynotfound', success)
          http = utils.createServer(app)
        })
    })

    it('should accept defined routes', function () {
      return utils.makeFetcher(popsicleServer(http))
        .fetch('/definitelynotfound', { method: 'GET' })
        .then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.status).to.equal(200)
        })
    })
  })

  describe('secured handler', function () {
    beforeEach(function () {
      const users = {
        blakeembrey: {
          username: 'blakeembrey',
          password: 'hunter2'
        }
      }
      const securityRAMLPath = path.join(__dirname, 'fixtures/security.raml')
      const options = {
        server: { notFoundHandler: false },
        security: {
          basic_auth: {
            validateUser: function (username, password, done) {
              if (users[username] && users[username].password === password) {
                return done(null, true)
              }

              return done(null, false)
            }
          }
        }
      }
      return osprey.loadFile(securityRAMLPath, options)
        .then(function (middleware) {
          const app = ospreyRouter()
          app.use(middleware)
          app.get('/secured/basic', success)
          http = utils.createServer(app)
        })
    })

    it('should block unauthenticated access', function () {
      return utils.makeFetcher(popsicleServer(http))
        .fetch('/secured/basic', { method: 'GET' })
        .then(function (res) {
          expect(res.status).to.equal(401)
        })
    })

    it('should allow access with basic authentication', function () {
      return utils.makeFetcher(popsicleServer(http), auth('blakeembrey', 'hunter2'))
        .fetch('/secured/basic', { method: 'GET' })
        .then(function (res) {
          expect(res.status).to.equal(200)
        })
    })
  })

  describe('method handler options', function () {
    beforeEach(function () {
      return osprey.loadFile(EXAMPLE_RAML_PATH, { server: { discardUnknownQueryParameters: false } })
        .then(function (middleware) {
          const app = ospreyRouter()
          app.use(middleware)
          app.get('/users', function (req, res) {
            res.setHeader('Content-Type', 'application/json')
            res.end(req.url)
          })

          http = utils.createServer(app)
        })
    })

    it('should accept server options in the method handler', function () {
      return utils.makeFetcher(popsicleServer(http))
        .fetch('/users?x=1&y=2', { method: 'GET' })
        .then(function (res) {
          expect(res.body).to.equal('/users?x=1&y=2')
          expect(res.status).to.equal(200)
        })
    })
  })
})

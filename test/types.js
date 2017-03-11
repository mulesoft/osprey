/* global describe, before, after, it */

var expect = require('chai').expect
var popsicle = require('popsicle')
var router = require('osprey-router')
var join = require('path').join
var serverAddress = require('server-address')
var parser = require('raml-1-parser')
var osprey = require('../')
var utils = require('./support/utils')

var EXAMPLE_RAML_PATH = join(__dirname, 'fixtures/types.raml')

var success = utils.response('success')

describe('RAML types', function () {
  var app
  var proxy
  var server

  before(function () {
    app = router()
    server = serverAddress(utils.createServer(app))

    server.listen()

    return parser.loadRAML(EXAMPLE_RAML_PATH)
      .then(function (ramlApi) {
        var raml = ramlApi.expand(true).toJSON({
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

  describe('libs', function () {
    it('should accept valid data', function () {
      app.post('/users', success)

      return popsicle.default({
        url: proxy.url('/users'),
        method: 'post',
        body: {
          firstname: 'john',
          lastname: 'doe',
          age: 1
        }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid data', function () {
      app.post('/users', success)

      return popsicle.default({
        url: proxy.url('/users'),
        method: 'post',
        body: {}
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept valid query types', function () {
      app.get('/users', success)

      return popsicle.default({
        url: proxy.url('/users?sort=asc'),
        method: 'get'
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid query types', function () {
      app.get('/users', success)

      return popsicle.default({
        url: proxy.url('/users'),
        method: 'get'
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })
  })

  describe('built-in types', function () {
    it('should accept any type of data when type: any', function () {
      app.post('/any', success)

      return popsicle.default({
        url: proxy.url('/any'),
        method: 'post',
        body: {
          anyone: 'one',
          anytwo: 12,
          anythree: [1, 2, 3]
        }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should accept valid object properties', function () {
      app.post('/object', success)

      return popsicle.default({
        url: proxy.url('/object'),
        method: 'post',
        body: {
          obj: {
            existing_property: 'valid'
          }
        }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid object properties', function () {
      app.post('/object', success)

      return popsicle.default({
        url: proxy.url('/object'),
        method: 'post',
        body: {
          obj: {
            existing_property: 'valid',
            additional_property: 'invalid'
          }
        }
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept valid array properties', function () {
      app.post('/array', success)

      return popsicle.default({
        url: proxy.url('/array'),
        method: 'post',
        body: {
          choices: ['a', 'b', 'c']
        }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid array properties', function () {
      app.post('/array', success)

      return popsicle.default({
        url: proxy.url('/array'),
        method: 'post',
        body: {
          choices: ['a', 'b', 'c', 'a']
        }
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept arrays as root element', function () {
      app.post('/arrayRoot', success)

      return popsicle.default({
        url: proxy.url('/arrayRoot'),
        method: 'post',
        body: [
          'a', 'b', 'c', 'd'
        ]
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })
  })

  it('should reject objects when an array is expected as root element', function () {
    app.post('/arrayRoot', success)

    return popsicle.default({
      url: proxy.url('/arrayRoot'),
      method: 'post',
      body: {
        foo: 'bar'
      }
    }).then(function (res) {
      expect(res.status).to.equal(400)
    })
  })

  describe('scalar types', function () {
    it('should accept valid scalar types', function () {
      app.post('/people', success)

      return popsicle.default({
        url: proxy.url('/people'),
        method: 'post',
        body: {
          firstname: 'john',
          lastname: 'doe',
          phone: '333-222-4444',
          birthday: '1999-12-31',
          head: 1,
          emails: ['john@doe.com'],
          married: false,
          dogOrCat: 'cat'
        }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid scalar types', function () {
      app.post('/people', success)

      return popsicle.default({
        url: proxy.url('/people'),
        method: 'post',
        body: {
          firstname: 1,
          lastname: 1,
          phone: '1111-222',
          // birthday: '1999-12-31T21:00:00',
          birthday: '1999-12',
          head: 3,
          emails: [],
          married: 'false',
          dogOrCat: 'fish',
          optionalTastes: []
        }
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept strings as root element', function () {
      app.post('/stringRoot', success)

      return popsicle.default({
        url: proxy.url('/stringRoot'),
        method: 'post',
        body: '"test"',
        headers: { 'Content-Type': 'application/json' }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject integers when a string is expected as root element', function () {
      app.post('/stringRoot', success)

      return popsicle.default({
        url: proxy.url('/stringRoot'),
        method: 'post',
        body: 7,
        headers: { 'Content-Type': 'application/json' }
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })
  })

  it('should accept objects as root element', function () {
    app.post('/objectRoot', success)

    return popsicle.default({
      url: proxy.url('/objectRoot'),
      method: 'post',
      body: {
        foo: 'bar'
      },
      headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
      expect(res.body).to.equal('success')
      expect(res.status).to.equal(200)
    })
  })

  it('should reject integers when an object is expected as root element', function () {
    app.post('/objectRoot', success)

    return popsicle.default({
      url: proxy.url('/stringRoot'),
      method: 'post',
      body: 7,
      headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
      expect(res.status).to.equal(400)
    })
  })

  describe('resource types', function () {
    it('should accept valid Client bodies', function () {
      app.post('/clients', success)

      return popsicle.default({
        url: proxy.url('/clients'),
        method: 'post',
        body: {
          id: 7,
          name: 'very important client'
        }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid Client bodies', function () {
      app.post('/clients', success)

      return popsicle.default({
        url: proxy.url('/clients'),
        method: 'post',
        body: {
          id: '7'
        }
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept valid Resource bodies', function () {
      app.post('/resource', success)

      return popsicle.default({
        url: proxy.url('/resource'),
        method: 'post',
        body: {
          name: 'amazing resource'
        }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid Resource bodies', function () {
      app.post('/resource', success)

      return popsicle.default({
        url: proxy.url('/resource'),
        method: 'post',
        body: {
          name: 1234
        }
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })
  })
})

/* global describe, before, after, it, context */

const expect = require('chai').expect
const ospreyRouter = require('osprey-router')
const path = require('path')
const ServerAddress = require('server-address').ServerAddress
const wap = require('webapi-parser').WebApiParser

const osprey = require('../')
const utils = require('./support/utils')
const success = utils.response('success')

const EXAMPLE_RAML_PATH = path.join(__dirname, 'fixtures/types.raml')

describe('RAML types', function () {
  let app
  let proxy
  let server

  before(async function () {
    app = ospreyRouter()
    server = new ServerAddress(utils.createServer(app))

    server.listen()

    const model = await wap.raml10.parse(`file://${EXAMPLE_RAML_PATH}`)
    const resolved = await wap.raml10.resolve(model)
    const ospreyApp = osprey.server(resolved)
    const proxyApp = osprey.proxy(ospreyApp, server.url())

    proxy = new ServerAddress(proxyApp)
    proxy.listen()
  })

  after(function () {
    proxy.close()
    server.close()
  })

  describe('libs', function () {
    it('should accept valid data', function () {
      app.post('/users', success)

      return utils.makeFetcher().fetch(proxy.url('/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: 'john',
          lastname: 'doe',
          age: 1
        })
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid data', function () {
      app.post('/users', success)

      return utils.makeFetcher().fetch(proxy.url('/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(123)
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept valid query types', function () {
      app.get('/users', success)

      return utils.makeFetcher().fetch(proxy.url('/users?sort=asc'), {
        method: 'GET'
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid query types', function () {
      app.get('/users', success)

      return utils.makeFetcher().fetch(proxy.url('/users'), {
        method: 'GET'
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })
  })

  describe('built-in types', function () {
    context('when type: any', function () {
      it('should accept any type of data', function () {
        app.post('/any', success)

        return utils.makeFetcher().fetch(proxy.url('/any'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anyone: 'one',
            anytwo: 12,
            anythree: [1, 2, 3]
          })
        }).then(function (res) {
          expect(res.body).to.equal('success')
          expect(res.status).to.equal(200)
        })
      })
    })

    it('should accept valid object properties', function () {
      app.post('/object', success)

      return utils.makeFetcher().fetch(proxy.url('/object'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          obj: {
            existing_property: 'valid'
          }
        })
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid object properties', function () {
      app.post('/object', success)

      return utils.makeFetcher().fetch(proxy.url('/object'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          obj: {
            existing_property: 'valid',
            additional_property: 'invalid'
          }
        })
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept valid array properties', function () {
      app.post('/array', success)

      return utils.makeFetcher().fetch(proxy.url('/array'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choices: ['a', 'b', 'c']
        })
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid array properties', function () {
      app.post('/array', success)

      return utils.makeFetcher().fetch(proxy.url('/array'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choices: ['a', 'b', 'c', 'a']
        })
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept arrays as root element', function () {
      app.post('/arrayRoot', success)

      return utils.makeFetcher().fetch(proxy.url('/arrayRoot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          'a', 'b', 'c', 'd'
        ])
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })
  })

  context('when an array is expected as root element', function () {
    it('should reject objects', function () {
      app.post('/arrayRoot', success)

      return utils.makeFetcher().fetch(proxy.url('/arrayRoot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foo: 'bar'
        })
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })
  })

  describe('scalar types', function () {
    it('should accept valid scalar types', function () {
      app.post('/people', success)

      return utils.makeFetcher().fetch(proxy.url('/people'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: 'john',
          lastname: 'doe',
          phone: '333-222-4444',
          birthday: '1999-12-31',
          head: 1,
          emails: ['john@doe.com'],
          married: false,
          dogOrCat: 'cat'
        })
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid scalar types', function () {
      app.post('/people', success)

      return utils.makeFetcher().fetch(proxy.url('/people'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept strings as root element', function () {
      app.post('/stringRoot', success)

      return utils.makeFetcher().fetch(proxy.url('/stringRoot'), {
        method: 'POST',
        body: '"test"',
        headers: { 'Content-Type': 'application/json' }
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    context('when a string is expected as root element', function () {
      it('should reject integers', function () {
        app.post('/stringRoot', success)

        return utils.makeFetcher().fetch(proxy.url('/stringRoot'), {
          method: 'POST',
          body: '7',
          headers: { 'Content-Type': 'application/json' }
        }).then(function (res) {
          expect(res.status).to.equal(400)
        })
      })
    })
  })

  it('should accept objects as root element', function () {
    app.post('/objectRoot', success)

    return utils.makeFetcher().fetch(proxy.url('/objectRoot'), {
      method: 'POST',
      body: JSON.stringify({
        foo: 'bar'
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
      expect(res.body).to.equal('success')
      expect(res.status).to.equal(200)
    })
  })

  context('when an object is expected as root element', function () {
    it('should reject integers', function () {
      app.post('/objectRoot', success)

      return utils.makeFetcher().fetch(proxy.url('/stringRoot'), {
        method: 'POST',
        body: '7',
        headers: { 'Content-Type': 'application/json' }
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })
  })

  describe('resource types', function () {
    it('should accept valid Client bodies', function () {
      app.post('/clients', success)

      return utils.makeFetcher().fetch(proxy.url('/clients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 7,
          name: 'very important client'
        })
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid Client bodies', function () {
      app.post('/clients', success)

      return utils.makeFetcher().fetch(proxy.url('/clients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: '7'
        })
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })

    it('should accept valid Resource bodies', function () {
      app.post('/resource', success)

      return utils.makeFetcher().fetch(proxy.url('/resource'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'amazing resource'
        })
      }).then(function (res) {
        expect(res.body).to.equal('success')
        expect(res.status).to.equal(200)
      })
    })

    it('should reject invalid Resource bodies', function () {
      app.post('/resource', success)

      return utils.makeFetcher().fetch(proxy.url('/resource'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 1234
        })
      }).then(function (res) {
        expect(res.status).to.equal(400)
      })
    })
  })
})

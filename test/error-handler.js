/* global describe, beforeEach, it */

var expect = require('chai').expect
var utils = require('./support/utils')
var osprey = require('../')
var popsicleServer = require('popsicle-server')

describe('error handler', function () {
  var app

  beforeEach(function () {
    app = osprey.Router()
  })

  function test (ramlBody, requestBody, headers) {
    var path = '/' + Math.random().toString(36).substr(2)

    app.use(osprey.server({
      resources: [{
        relativeUri: path,
        methods: [{
          method: 'post',
          body: ramlBody
        }]
      }]
    }))

    app.use(osprey.errorHandler())

    app.post(path, utils.response('bad bad bad'))

    var mw = popsicleServer(utils.createServer(app))
    return utils.makeFetcher(mw).fetch(path, {
      method: 'POST',
      body: requestBody,
      headers: headers
    })
  }

  describe('json', function () {
    it('should render json', function () {
      return test({
        'application/json': {
          schema: JSON.stringify({ type: 'string' })
        }
      }, '123', {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
        .then(function (res) {
          expect(res.headers.get('Content-Type')).to.equal('application/json')
        })
    })
  })
})

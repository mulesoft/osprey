/* global describe, beforeEach, it */

var expect = require('chai').expect
var popsicle = require('popsicle')
var server = require('popsicle-server')
var utils = require('./support/utils')
var osprey = require('../')

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

    return popsicle.post({
      url: path,
      body: requestBody,
      headers: headers,
      use: [popsicle.plugins.concatStream('string')]
    })
      .use(server(utils.createServer(app)))
  }

  describe('json', function () {
    it('should render json', function () {
      return test({
        'application/json': {
          schema: JSON.stringify({ type: 'string' })
        }
      }, '123', {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
        .then(function (res) {
          expect(res.headers['content-type']).to.equal('application/json')
        })
    })
  })
})

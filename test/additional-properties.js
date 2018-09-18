/* global describe, it */
/**
 * Test https://github.com/mulesoft/osprey/issues/154
 */

var expect = require('chai').expect
var expandTypes = require('../lib/raml')

describe('Additional properties', function () {
  it('should be expanded correctly', function () {
    return require('raml-1-parser')
      .loadRAML('test/fixtures/additional-properties.raml', { rejectOnErrors: true })
      .then(function (ramlApi) {
        var raml = ramlApi.expand(true).toJSON({
          serializeMetadata: false
        })
        raml = expandTypes(raml)
        expect(
          raml.resources[0].methods[0].body['application/json'].additionalProperties
        ).to.equal(false)
      })
  })
})

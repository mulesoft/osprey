/* global describe, it */

var rewire = require('rewire')
var osprey = rewire('../')
var server = rewire('../lib/server')
var expect = require('chai').expect
var path = require('path')

var SECURITY_HEADERS = path.join(__dirname, 'fixtures', 'security-headers.raml')
describe('osprey.addJsonSchema', function () {
  var schemas = {}
  osprey.__set__('methodHandler', {
    addJsonSchema: function (schema, key) {
      schemas[key] = schema
    }
  })

  it('should call osprey-method-handler.addJsonSchema', function () {
    var schema = {
      properties: {
        name: {
          type: 'string'
        }
      }
    }
    expect(schemas).to.be.deep.equal({})
    osprey.addJsonSchema(schema, 'cats')
    expect(schemas).to.be.deep.equal({ cats: schema })
  })
})
describe('server.addSecurityHeaders()', function () {
  var addSecurityHeaders = server.__get__('addSecurityHeaders')
  it('should duplicate securityScheme headers on the resources describedBy them.', function () {
    return require('raml-1-parser')
      .loadRAML(SECURITY_HEADERS, { rejectOnErrors: true })
      .then(function (ramlApi) {
        var raml = ramlApi.expand(true).toJSON({
          serializeMetadata: false
        })
        var result = addSecurityHeaders(raml)
        expect(result.resources[0].methods[0].headers).to.deep.equal({
          'Custom-Token': {
            name: 'Custom-Token',
            displayName: 'Custom-Token',
            type: 'string',
            required: false,
            repeat: false
          }
        })
      })
  })
})

/* global describe, it */

const rewire = require('rewire')
const osprey = rewire('../')
const server = rewire('../lib/server')
const expect = require('chai').expect
const path = require('path')

const SECURITY_HEADERS = path.join(__dirname, 'fixtures', 'security-headers.raml')
describe('osprey.addJsonSchema', function () {
  const schemas = {}
  osprey.__set__('methodHandler', {
    addJsonSchema: function (schema, key) {
      schemas[key] = schema
    }
  })

  it('should call osprey-method-handler.addJsonSchema', function () {
    const schema = {
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
  const addSecurityHeaders = server.__get__('addSecurityHeaders')
  it('should duplicate securityScheme headers on the resources describedBy them.', function () {
    return require('raml-1-parser')
      .loadRAML(SECURITY_HEADERS, { rejectOnErrors: true })
      .then(function (ramlApi) {
        const raml = ramlApi.expand(true).toJSON({
          serializeMetadata: false
        })
        const result = addSecurityHeaders(raml)
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

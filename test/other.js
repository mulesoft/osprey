/* global describe, it */

var rewire = require('rewire')
var osprey = rewire('../')
var expect = require('chai').expect

describe('osprey.addJsonSchema', function () {
  var schemas = {}
  osprey.__set__('methodHandler', {
    addJsonSchema: function (schema, key) {
      schemas[key] = schema
    }
  })

  it('should call osprey-method-handler.addJsonSchema', function () {
    var schema = {
      'properties': {
        'name': {
          'type': 'string'
        }
      }
    }
    expect(schemas).to.be.deep.equal({})
    osprey.addJsonSchema(schema, 'cats')
    expect(schemas).to.be.deep.equal({'cats': schema})
  })
})

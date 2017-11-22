/* global describe, it */
/**
 * Test https://github.com/mulesoft/osprey/issues/154
 */

var dtexp = require('datatype-expansion')
var expect = require('chai').expect

var NON_EXPANDABLE_TYPES = [
  'any', 'object', 'array',
  'string', 'number', 'integer', 'boolean', 'file',
  'date-only', 'time-only', 'datetime-only', 'datetime'
]

function expandTypes (raml) {
  var ctx = _createTypesContext(raml.types)
  if (!ctx) {
    return raml
  }

  function _expand (data, ctx) {
    if (!(data instanceof Object)) {
      return data
    }

    for (var key in data) {
      var val = data[key]

      if (val instanceof Array) {
        data[key] = []
        val.forEach(function (el) {
          data[key].push(_expand(el, ctx))
        })
        continue
      }

      if (val instanceof Object) {
        data[key] = _expand(val, ctx)
        continue
      }
    }

    var isExpandable = data.type &&
      data.type.length === 1 &&
      NON_EXPANDABLE_TYPES.indexOf(data.type[0]) === -1

    if (isExpandable) {
      var expanded = dtexp.expandedForm(data, ctx)
      return dtexp.canonicalForm(expanded)
    }

    return data
  }

  function _createTypesContext (types) {
    if (!types || types.length < 1) {
      return
    }
    var ctx = {}
    types.forEach(function (el) {
      for (var key in el) {
        ctx[key] = el[key]
      }
    })
    return ctx
  }

  if (raml.resources) {
    raml.resources = _expand(raml.resources, ctx)
  }

  return raml
}

describe('Additional properties', function () {
  it('should be expanded correctly', function () {
    return require('raml-1-parser')
      .loadRAML('test/fixtures/additional-properties.raml', {rejectOnErrors: true})
      .then(function (ramlApi) {
        var raml = ramlApi.expand(true).toJSON({
          serializeMetadata: false
        })
        raml = expandTypes(raml)
        expect(
          raml.resources[0].methods[0].body['application/json'].additionalProperties
        ).to.be.false
      })
  })
})

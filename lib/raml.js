var dtexp = require('datatype-expansion')

module.exports = expandTypes

/**
 * Non-expandable RAML 1.0 types.
 *
 * @type {Array}
 */
var NON_EXPANDABLE_TYPES = [
  'any', 'object', 'array',
  'string', 'number', 'integer', 'boolean', 'file',
  'date-only', 'time-only', 'datetime-only', 'datetime'
]

/**
 * Expand RAML 1.0 types.
 *
 * @param  {Object}   raml
 * @param  {Object}
 */
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

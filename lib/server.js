var parseurl = require('parseurl')
var router = require('osprey-router')
var resources = require('osprey-resources')
var handler = require('osprey-method-handler')
var dtexp = require('datatype-expansion')

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
 * Expose `createServer`.
 */
module.exports = createServer
module.exports.notFoundHandler = notFoundHandler

/**
 * Create server middleware.
 *
 * @param  {Object}   raml
 * @param  {Object}   options
 * @return {Function}
 */
function createServer (raml, opts) {
  var options = opts || {}

  if (raml.hasOwnProperty('types')) {
    raml = expandTypes(raml)
  }

  var resourceHandler = resources(raml.resources, function (schema, path) {
    return handler(schema, path, schema.method, options)
  })

  var app = router({ ramlUriParameters: resourceHandler.ramlUriParameters, RAMLVersion: options.RAMLVersion })
  var corsOpts = typeof options.cors === 'boolean' ? undefined : options.cors

  if (options.cors) {
    var cors = require('cors')

    app.options('*', cors(corsOpts))
    app.use(cors(corsOpts))
  }

  if (options.compression) {
    var compression = require('compression')

    app.use(compression())
  }

  app.use(resourceHandler)

  if (options.notFoundHandler !== false) {
    app.use(notFoundHandler)
  }

  return app
}

/**
 * The Osprey not found handler is simplistic and tests for `resourcePath`.
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
function notFoundHandler (req, res, next) {
  // Check for existence of the method handler.
  if (req.resourcePath) {
    return next()
  }

  var notFoundError = new Error(
    req.method + ' ' + parseurl(req).pathname +
    ' does not exist in the RAML for this application'
  )

  notFoundError.ramlNotFound = true
  notFoundError.status = notFoundError.statusCode = 404

  return next(notFoundError)
}

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

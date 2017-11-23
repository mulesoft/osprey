var parseurl = require('parseurl')
var router = require('osprey-router')
var resources = require('osprey-resources')
var handler = require('osprey-method-handler')
var expandTypes = require('./raml')

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

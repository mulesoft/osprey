var Router = require('osprey-router')
var compose = require('compose-middleware').compose
var methodHandler = require('osprey-method-handler')
var server = require('./lib/server')
var proxy = require('./lib/proxy')
var security = require('./lib/security')
var errorHandler = require('request-error-handler')
var extend = require('xtend')

/**
 * Expose functions.
 */
exports.Router = Router
exports.server = server
exports.proxy = proxy
exports.security = security
exports.errorHandler = errorHandler

/**
 * Proxy JSON schema addition to method handler.
 */
exports.addJsonSchema = function (schema, key) {
  methodHandler.addJsonSchema(schema, key)
}

/**
 * Load an Osprey server directly from a RAML file.
 *
 * @param  {String}  path
 * @param  {Object}  opts
 * @return {Promise}
 */
exports.loadFile = function (path, opts) {
  var options = opts || {}

  return require('raml-1-parser')
    .loadRAML(path, { rejectOnErrors: true })
    .then(function (ramlApi) {
      var raml = ramlApi.expand(true).toJSON({
        serializeMetadata: false
      })
      var middleware = []
      var handler = server(raml, extend({ RAMLVersion: ramlApi.RAMLVersion() }, options.server))
      var error = errorHandler(options.errorHandler)

      if (options.security) {
        middleware.push(security(raml, options.security))
      }

      middleware.push(handler)

      if (!options.disableErrorInterception) {
        middleware.push(error)
      }

      var result = compose(middleware)
      result.ramlUriParameters = handler.ramlUriParameters
      return result
    })
}

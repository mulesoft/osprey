var Router = require('osprey-router')
var compose = require('compose-middleware').compose
var methodHandler = require('osprey-method-handler')
var server = require('./lib/server')
var proxy = require('./lib/proxy')
var security = require('./lib/security')
var errorHandler = require('request-error-handler')

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
 * @param  {Object}  options
 * @return {Promise}
 */
exports.loadFile = function (path, options) {
  options = options || {}

  return require('raml-parser')
    .loadFile(path)
    .then(function (raml) {
      return compose(
        security(raml, options.security),
        server(raml, options.server),
        errorHandler()
      )
    })
}

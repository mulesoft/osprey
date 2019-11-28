const Router = require('osprey-router')
const compose = require('compose-middleware').compose
const methodHandler = require('osprey-method-handler')
const errorHandler = require('request-error-handler')
const extend = require('xtend')
const wap = require('webapi-parser').WebApiParser

const server = require('./lib/server')
const proxy = require('./lib/proxy')
const security = require('./lib/security')

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
exports.loadFile = function (path, options = {}) {
  return wap.raml10.parse(path)
    .then(model => wap.raml10.resolve(model))
    .then(model => {
      const middleware = []
      const RAMLVersion = model.raw.indexOf('RAML 1.0') >= 0
        ? 'RAML10'
        : 'RAML08'
      const handler = server(
        model,
        extend({ RAMLVersion }, options.server))
      const error = errorHandler(options.errorHandler)

      if (options.security) {
        middleware.push(
        // 1 DIVED HERE --v
          security(model, options.security))
      }

      middleware.push(handler)

      if (!options.disableErrorInterception) {
        middleware.push(error)
      }

      const result = compose(middleware)
      result.ramlUriParameters = handler.ramlUriParameters
      return result
    })
}

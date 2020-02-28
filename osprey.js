const Router = require('osprey-router')
const compose = require('compose-middleware').compose
const ospreyMethodHandler = require('osprey-method-handler')
const errorHandler = require('request-error-handler')
const wap = require('webapi-parser').WebApiParser
const path = require('path')

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
  ospreyMethodHandler.addJsonSchema(schema, key)
}

/**
 * Load an Osprey server directly from a RAML file.
 *
 * @param  {String}  fpath
 * @param  {Object}  options
 * @return {Promise}
 */
exports.loadFile = async function (fpath, options = {}) {
  fpath = path.resolve(fpath)
  fpath = fpath.startsWith('file:') ? fpath : `file://${fpath}`

  let model
  try {
    model = await wap.raml10.parse(fpath)
    model = await wap.raml10.resolve(model)
  } catch (e) {
    model = await wap.raml08.parse(fpath)
    model = await wap.raml08.resolve(model)
  }

  const middleware = []
  const handler = server(model, options.server)
  const error = errorHandler(options.errorHandler)

  if (options.security) {
    middleware.push(security(model, options.security))
  }

  middleware.push(handler)

  if (!options.disableErrorInterception) {
    middleware.push(error)
  }

  const result = compose(middleware)
  result.ramlUriParameters = handler.ramlUriParameters
  return result
}

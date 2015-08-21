var Router = require('osprey-router')
var server = require('./lib/server')
var proxy = require('./lib/proxy')
var security = require('./lib/security')
var errorHandler = require('./lib/error-handler')

/**
 * Expose functions.
 */
exports.Router = Router
exports.server = server
exports.proxy = proxy
exports.security = security
exports.errorHandler = errorHandler

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
      var app = new Router()

      // Mount security middleware before validation.
      app.use(security(raml, options.security))
      app.use(server(raml, options.server))
      app.use(errorHandler())

      return app
    })
}

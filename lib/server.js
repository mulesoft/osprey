const parseurl = require('parseurl')
const router = require('osprey-router')
const resources = require('osprey-resources')
const handler = require('osprey-method-handler')
const wp = require('webapi-parser')

/**
 * Expose `createServer`.
 */
module.exports = createServer
module.exports.notFoundHandler = notFoundHandler

/**
 * Create server middleware.
 *
 * @param  {WebApiDocument} model
 * @param  {Object} options
 * @return {Function}
 */
// function createServer (raml, options = {}) {
function createServer (model, options = {}) {
  // 2 DIVED HERE >>v
  model = addSecurityHeaders(model)

  const resourceHandler = resources(
    raml.resources,
    function (schema, path) {
      return handler(schema, path, schema.method, options)
    })

  const app = router({
    ramlUriParameters: resourceHandler.ramlUriParameters,
    RAMLVersion: options.RAMLVersion
  })
  const corsOpts = typeof options.cors === 'boolean'
    ? undefined
    : options.cors

  if (options.cors) {
    const cors = require('cors')

    app.options('*', cors(corsOpts))
    app.use(cors(corsOpts))
  }

  if (options.compression) {
    const compression = require('compression')

    app.use(compression())
  }

  app.use(resourceHandler)

  if (options.notFoundHandler !== false) {
    app.use(notFoundHandler)
  }

  return app
}

/**
 * Adds security headers to applicable methods.
 *
 * @param {WebApiDocument} model
 */
function addSecurityHeaders (model) {
  model.encodes.endPoints.forEach(endpoint => {
    endpoint.operations.forEach(method => {
      const securedBy = method.security || []
      securedBy.forEach(sec => {
        const request = method.request || new wp.model.domain.Request()
        const reqHeadersIds = (request.headers || []).map(h => h.id)
        const securityHeaders = sec.headers || []
        securityHeaders.forEach(header => {
          const requestHasHeader = reqHeadersIds.indexOf(header.id) !== -1
          if (!requestHasHeader) {
            request.withHeader(header)
          }
        })
        method.withRequest(request)
      })
    })
  })
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

  const notFoundError = new Error(
    req.method + ' ' + parseurl(req).pathname +
    ' does not exist in the RAML for this application'
  )

  notFoundError.ramlNotFound = true
  notFoundError.status = notFoundError.statusCode = 404

  return next(notFoundError)
}

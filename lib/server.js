const parseurl = require('parseurl')
const ospreyRouter = require('osprey-router')
const ospreyResources = require('osprey-resources')
const ospreyMethodHandler = require('osprey-method-handler')
const wp = require('webapi-parser')

/**
 * Expose `createServer`.
 */
module.exports = createServer
module.exports.notFoundHandler = notFoundHandler

/**
 * Create server middleware.
 *
 * @param  {webapi-parser.WebApiDocument} model
 * @param  {Object} options
 * @return {Function}
 */
function createServer (model, options = {}) {
  addSecurityHeaders(model)

  const resourceHandler = ospreyResources(
    model.encodes.endPoints,
    /* @param  {webapi-parser.Operation} method */
    function (method, path) {
      return ospreyMethodHandler(
        method, path, method.method.value(), options)
    })

  const app = ospreyRouter({
    ramlUriParameters: resourceHandler.ramlUriParameters
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
 * @param {webapi-parser.WebApiDocument} model
 */
function addSecurityHeaders (model) {
  model.encodes.endPoints.forEach(endpoint => {
    endpoint.operations.forEach(method => {
      const securedBy = method.security || []
      securedBy.forEach(sec => {
        if (sec.scheme === null) {
          return
        }
        const request = method.request || new wp.model.domain.Request()
        const reqHeaders = request.headers || []
        const methodSecurityHeaders = sec.scheme.headers || []
        const reqHeadersIds = reqHeaders.map(h => h.id)
        methodSecurityHeaders.forEach(header => {
          const requestHasHeader = reqHeadersIds.indexOf(header.id) !== -1
          if (!requestHasHeader) {
            reqHeaders.push(header)
            reqHeadersIds.push(header.id)
          }
        })
        request.withHeaders(reqHeaders)
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

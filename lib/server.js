const parseurl = require('parseurl')
const router = require('osprey-router')
const resources = require('osprey-resources')
const handler = require('osprey-method-handler')
const expandTypes = require('./raml')

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
  const options = opts || {}

  if (Object.prototype.hasOwnProperty.call(raml, 'types')) {
    raml = expandTypes(raml)
  }

  raml = addSecurityHeaders(raml)

  const resourceHandler = resources(raml.resources, function (schema, path) {
    return handler(schema, path, schema.method, options)
  })

  const app = router({ ramlUriParameters: resourceHandler.ramlUriParameters, RAMLVersion: options.RAMLVersion })
  const corsOpts = typeof options.cors === 'boolean' ? undefined : options.cors

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
 * Adds security headers to applicable resources..
 *
 * @param {Object} raml
 */
function addSecurityHeaders (raml) {
  raml.resources = raml.resources.map(function (resource) {
    if (resource && resource.methods) {
      resource.methods = resource.methods.map(function (method) {
        const securedBy = method.securedBy

        if (securedBy) {
          method.headers = securedBy.reduce(function (headers, securedById) {
            const scheme = raml.securitySchemes.filter(function (scheme) {
              if (Object.keys(scheme)[0] === securedById) return true
              return false
            })[0]

            if (scheme && scheme[securedById]) {
              const newHeader = Object.keys(scheme[securedById].describedBy.headers)[0]
              headers[newHeader] = scheme[securedById].describedBy.headers[newHeader]
            }
            return headers
          }, method.headers || {})
        }
        return method
      })
    }
    return resource
  })
  return raml
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

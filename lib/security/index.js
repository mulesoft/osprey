const extend = require('xtend')
const invariant = require('invariant')
const createError = require('http-errors')
const compose = require('compose-middleware').compose
const debug = require('debug')('osprey:security')
const resources = require('osprey-resources')

const scope = require('./scope')
const handler = require('./handler')

/**
 * Expose security middleware.
 */
module.exports = createSecurity
module.exports.scope = scope

/**
 * Create a security middleware function from RAML.
 *
 * @param  {webapi-parser.WebApiDocument} model
 * @param  {Object}   opts
 * @return {Function}
 */
function createSecurity (model, opts) {
  const middleware = []
  const options = extend(opts)
  const authenticate = {}

  // Create scheme handlers from RAML.
  if (Array.isArray(raml.securitySchemes)) {
    raml.securitySchemes.forEach(function (schemes) {
      Object.keys(schemes).forEach(function (key) {
        const scheme = schemes[key]
        const handlerOptions = options[key]

        if (!handlerOptions) {
          console.warn('No options configured for security scheme "%s"', key)
          return
        }

        const res = handler(scheme, handlerOptions, key)

        invariant(
          res && typeof res.handler === 'function',
          'Security schemes must provide a `handler` function that can ' +
          'accept  options and return middleware for securing resources'
        )

        // Alias the handler for creating authentication middleware.
        authenticate[key] = res.handler

        // Mount routers in order of security schemes.
        // Note: Not all schemes need a router. E.g. "Basic Authentication".
        if (res.router) {
          middleware.push(res.router)
        }
      })
    })
  }

  middleware.push(resources(raml.resources, function (method, path) {
    const securedBy = method.securedBy || raml.securedBy

    if (!Array.isArray(securedBy) || securedBy.length === 0) {
      return
    }

    const handlers = []
    let anonymous = false
    let middleware

    for (let i = 0; i < securedBy.length; i++) {
      const secured = securedBy[i]

      // Support anonymous access.
      if (secured == null) {
        anonymous = true
        continue
      }

      // Handle the basic case of a security string.
      if (typeof secured === 'string') {
        if (Object.prototype.hasOwnProperty.call(authenticate, secured)) {
          middleware = compose(authenticate[secured](null, path))

          handlers.push(middleware)
        } else {
          debug('Path "%s" not secured with "%s"', path, secured)
        }
        continue
      }

      // Support more complex object options.
      Object.keys(secured).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(authenticate, key)) {
          middleware = compose(authenticate[key](secured[key], path))

          handlers.push(middleware)
        } else {
          debug('Path "%s" not secured with "%s"', path, key)
        }
      })
    }

    // Create a single middleware from an array of handlers.
    return authenticationStack(handlers, anonymous)
  }))

  return compose(middleware)
}

/**
 * Create a middleware function from a stack of handlers.
 *
 * @param  {Array}    handlers
 * @param  {Boolean}  allowAnonymous
 * @return {Function}
 */
function authenticationStack (handlers, allowAnonymous) {
  if (!handlers.length) {
    return
  }

  return function (req, res, done) {
    let index = 1
    const errors = []

    function next (err) {
      // Fix Passport.js messing with request: jaredhanson/passport#390
      res.statusCode = 200
      res.removeHeader('WWW-Authenticate')

      // Enable exiting early when authorization succeeds.
      if (!err) {
        return done()
      }

      // Keep track of all authorization errors.
      errors.push(err)

      if (index === handlers.length) {
        if (allowAnonymous) {
          return done()
        }

        // Use the errors status code, when it's the only error code.
        const status = errors.reduce(function (code, error) {
          if (code == null && error.status > 399 && error.status < 500) {
            return error.status
          }

          if (code != null && error.status === code) {
            return code
          }

          return 500
        }, null)

        // Create an error that can be handled later.
        const error = createError(status, 'Unauthorized')
        error.ramlAuthorization = true
        error.authorizationErrors = errors
        return done(error)
      }

      const handler = handlers[index++]

      return handler(req, res, next)
    }

    // Start outside the `next` handler.
    const handler = handlers[0]

    return handler(req, res, next)
  }
}

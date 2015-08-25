var extend = require('xtend')
var resources = require('osprey-resources')
var invariant = require('invariant')
var createError = require('http-errors')
var compose = require('compose-middleware').compose
var debug = require('debug')('osprey:security')
var scope = require('./scope')
var handler = require('./handler')

/**
 * Expose security middleware.
 */
module.exports = createSecurity
module.exports.scope = scope

/**
 * Create a security middleware function from RAML.
 *
 * @param  {Object}   raml
 * @param  {Object}   opts
 * @return {Function}
 */
function createSecurity (raml, opts) {
  var middleware = []
  var options = extend(opts)
  var authenticate = {}

  // Create scheme handlers from RAML.
  if (Array.isArray(raml.securitySchemes)) {
    raml.securitySchemes.forEach(function (schemes) {
      Object.keys(schemes).forEach(function (key) {
        var scheme = schemes[key]
        var handlerOptions = options[key]

        if (!handlerOptions) {
          console.warn('No options configured for security scheme "%s"', key)
          return
        }

        var res = handler(scheme, handlerOptions, key)

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
    var securedBy = method.securedBy || raml.securedBy

    if (!Array.isArray(securedBy) || securedBy.length === 0) {
      return
    }

    var handlers = []
    var anonymous = false
    var middleware

    for (var i = 0; i < securedBy.length; i++) {
      var secured = securedBy[i]

      // Support anonymous access.
      if (secured == null) {
        anonymous = true
        continue
      }

      // Handle the basic case of a security string.
      if (typeof secured === 'string') {
        if (authenticate.hasOwnProperty(secured)) {
          middleware = compose(authenticate[secured](null, path))

          handlers.push(middleware)
        } else {
          debug('Path "%s" not secured with "%s"', path, secured)
        }
        continue
      }

      // Support more complex object options.
      Object.keys(secured).forEach(function (key) {
        if (authenticate.hasOwnProperty(key)) {
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
    var index = 1
    var errors = []

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
        var status = errors.reduce(function (code, error) {
          if (code == null && error.status > 399 && error.status < 500) {
            return error.status
          }

          if (code != null && error.status === code) {
            return code
          }

          return 500
        }, null)

        // Create an error that can be handled later.
        var error = createError(status, 'Unauthorized')
        error.ramlAuthorization = true
        error.authorizationErrors = errors
        return done(error)
      }

      var handler = handlers[index++]

      return handler(req, res, next)
    }

    // Start outside the `next` handler.
    var handler = handlers[0]

    return handler(req, res, next)
  }
}

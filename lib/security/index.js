const extend = require('xtend')
const invariant = require('invariant')
const createError = require('http-errors')
const compose = require('compose-middleware').compose
const debug = require('debug')('osprey:security')
const ospreyResources = require('osprey-resources')

const enforceScope = require('./scope')
const createHandler = require('./handler')

/**
 * Expose security middleware.
 */
module.exports = createSecurity
module.exports.scope = enforceScope

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

  function isSecurityScheme (decl) {
    return decl.withOAuth2Settings !== undefined
  }
  const securitySchemes = model.declares.filter(isSecurityScheme)

  // Create scheme handlers from RAML.
  securitySchemes.forEach(scheme => {
    const name = scheme.name.value()
    const handlerOptions = options[name]

    if (!handlerOptions) {
      console.warn('No options configured for security scheme "%s"', name)
      return
    }
    const res = createHandler(scheme, handlerOptions, name)

    invariant(
      res && typeof res.handler === 'function',
      'Security schemes must provide a `handler` function that can ' +
      'accept  options and return middleware for securing resources'
    )

    // Alias the handler for creating authentication middleware.
    authenticate[name] = res.handler

    // Mount routers in order of security schemes.
    // Note: Not all schemes need a router. E.g. "Basic Authentication".
    if (res.router) {
      middleware.push(res.router)
    }
  })

  middleware.push(ospreyResources(model.encodes.endPoints, (method, path) => {
    const securedBy = (method.security && method.security.length > 0)
      ? method.security
      : model.security

    if (!Array.isArray(securedBy) || securedBy.length === 0) {
      return
    }

    const handlers = []
    let anonymous = false
    let middleware

    /*
     * @param {webapi-parser.ParametrizedSecurityScheme} secured
     */
    securedBy.forEach(secured => {
      // Support anonymous access.
      if (!secured.scheme) {
        anonymous = true
        return
      }

      const name = secured.name.value()
      if (Object.prototype.hasOwnProperty.call(authenticate, name)) {
        const schemeParams = secured.settings || null
        middleware = compose(authenticate[name](schemeParams, path))
        handlers.push(middleware)
      } else {
        debug('Path "%s" is not secured with "%s"', path, name)
      }
    })

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

  return (req, res, done) => {
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
        const status = errors.reduce((code, error) => {
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

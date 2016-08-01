var parse = require('url').parse
var parseurl = require('parseurl')
var querystring = require('querystring')
var router = require('osprey-router')
var oauth2orize = require('oauth2orize')
var invariant = require('invariant')
var passport = require('passport')
var cookieSession = require('cookie-session')
var BasicStrategy = require('passport-http').BasicStrategy
var DigestStrategy = require('passport-http').DigestStrategy
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
var BearerStrategy = require('passport-http-bearer').Strategy
var extend = require('xtend')
var bodyParser = require('body-parser')
var arrify = require('arrify')
var scope = require('./scope')

/**
 * Expose handler.
 */
module.exports = createHandler

/**
 * Create a handler object from an object of RAML security scheme options.
 *
 * @param  {Object} scheme
 * @param  {Object} options
 * @param  {String} key
 * @return {Object}
 */
function createHandler (scheme, options, key) {
  // Allow functions to override any other options.
  if (typeof options === 'function') {
    return options(scheme, key)
  }

  if (scheme.type === 'OAuth 2.0') {
    return createOAuth2Handler(scheme, options, key)
  }

  if (scheme.type === 'Basic Authentication') {
    return createBasicAuthHandler(scheme, options, key)
  }

  if (scheme.type === 'Digest Authentication') {
    return createDigestAuthHandler(scheme, options, key)
  }

  throw new TypeError(
    'To enable ' + scheme.type + ', you must provide a function as the ' +
    'option. The function must return an object with a handler method and, ' +
    'optionally, a middleware function (e.g. using `osprey-router`).'
  )
}

/**
 * Create a handler for OAuth 2.0.
 *
 * @param  {Object} scheme
 * @param  {Object} opts
 * @param  {String} key
 * @return {Object}
 */
function createOAuth2Handler (scheme, opts, key) {
  var app = router()
  var server = oauth2orize.createServer()
  var settings = scheme.settings
  var options = extend({ grant: {}, exchange: {} }, opts)
  var scopes = arrify(scheme.settings.scopes)

  var BASIC_KEY = 'osprey:' + key + ':basic'
  var CLIENT_PASSWORD_KEY = 'osprey:' + key + 'oauth2-client-password'
  var BEARER_KEY = 'osprey:' + key + ':bearer'

  invariant(
    settings.authorizationGrants && settings.authorizationGrants.length > 0,
    'RAML "authorizationGrants" must specify supported grant types'
  )

  invariant(
    typeof options.findUserByToken === 'function',
    'Option "findUserByToken" must be a function: %s',
    'https://github.com/jaredhanson/passport-http-bearer#configure-strategy'
  )

  invariant(
    typeof options.authenticateClient === 'function',
    'Option "authenticateClient" must be a function: %s',
    'https://github.com/jaredhanson/passport-oauth2-client-password#configure-strategy'
  )

  // Set up passport for authentication.
  passport.use(BASIC_KEY, new BasicStrategy(options.authenticateClient))
  passport.use(CLIENT_PASSWORD_KEY, new ClientPasswordStrategy(options.authenticateClient))
  passport.use(BEARER_KEY, new BearerStrategy(options.findUserByToken))

  var accessTokenUri = parse(options.accessTokenUri || settings.accessTokenUri).path

  // Body parsing middleware for OAuth 2.0 routes.
  var parseBody = [bodyParser.json(), bodyParser.urlencoded({ extended: false })]

  invariant(
    validPathEnding(settings.accessTokenUri, accessTokenUri),
    '`accessTokenUri` must match the suffix of the RAML `accessTokenUri` setting'
  )

  // Skip authorization page logic if not required.
  if (
    settings.authorizationGrants.indexOf('code') > -1 ||
    settings.authorizationGrants.indexOf('token') > -1
  ) {
    var serializeClient = options.serializeClient
    var deserializeClient = options.deserializeClient
    var sessionKeys = options.sessionKeys
    var ensureLoggedIn = options.ensureLoggedIn
    var authorizeClient = options.authorizeClient
    var serveAuthorizationPage = options.serveAuthorizationPage
    var immediateAuthorization = options.immediateAuthorization
    var authorizationUri = parse(options.authorizationUri || settings.authorizationUri).path

    invariant(
      validPathEnding(settings.authorizationUri, authorizationUri),
      '`authorizationUri` must match the suffix of the RAML `authorizationUri` setting'
    )

    invariant(
      typeof serializeClient === 'function',
      'Option "serializeClient" must be a function: %s',
      'https://github.com/jaredhanson/oauth2orize#session-serialization'
    )

    invariant(
      typeof deserializeClient === 'function',
      'Option "deserializeClient" must be a function: %s',
      'https://github.com/jaredhanson/oauth2orize#session-serialization'
    )

    invariant(
      Array.isArray(sessionKeys) && sessionKeys.length > 0,
      'Options "sessionKeys" must be an array: %s',
      'https://github.com/expressjs/cookie-session#keys'
    )

    invariant(
      typeof authorizeClient === 'function',
      'Option "authorizeClient" must be a function: %s',
      'https://github.com/jaredhanson/oauth2orize#implement-authorization-endpoint'
    )

    invariant(
      typeof serveAuthorizationPage === 'function',
      'Option "serveAuthorizationPage" must be a middleware function that ' +
      'serves the authorization dialog page'
    )

    invariant(
      typeof ensureLoggedIn === 'function',
      'Option "ensureLoggedIn" must be a middleware function that handles ' +
      'when the user is logged out'
    )

    server.serializeClient(serializeClient)
    server.deserializeClient(deserializeClient)

    // Create session middleware for Passport to work properly.
    var session = cookieSession({
      name: 'osprey-' + key,
      keys: options.sessionKeys
    })

    // Authorize client validation.
    var validate = function (clientId, redirectUri, scope, type, done) {
      validateScope(scopes, scope)

      return authorizeClient(clientId, redirectUri, scope, type, done)
    }

    // Set up immediate function. Wrap it for consistent arity.
    var immediate = immediateAuthorization ? function (client, user, scope, done) {
      // Custom callback for scope injection.
      function cb (err, validated) {
        return done(err, validated, { scope: scope })
      }

      return immediateAuthorization(client, user, scope, cb)
    } : null

    // Mount authorization page. DO NOT ENABLE CORS BEFORE THIS ROUTE!
    app.get(
      authorizationUri,
      session,
      ensureLoggedIn,
      attachQuery,
      attachRedirect,
      server.authorize(validate, immediate),
      serveAuthorizationPage
    )

    // Page to POST form to for authorization.
    app.post(
      authorizationUri,
      session,
      ensureLoggedIn,
      parseBody,
      attachRedirect,
      server.decision(function (req, done) {
        return done(null, {
          scope: arrify(req.body.scope)
        })
      })
    )
  }

  // Mount the access token endpoint.
  app.post(
    accessTokenUri,
    parseBody,
    passport.initialize(),
    passport.authenticate([BASIC_KEY, CLIENT_PASSWORD_KEY], { session: false }),
    server.token()
  )

  settings.authorizationGrants.forEach(function (grantType) {
    var grant = options.grant[grantType]
    var exchange = options.exchange[grantType]

    if (grantType === 'code') {
      invariant(
        typeof grant === 'function',
        'Option "grant.code" must be a function: %s',
        'https://github.com/jaredhanson/oauth2orize#register-grants'
      )

      invariant(
        typeof exchange === 'function',
        'Option "exchange.code" must be a function: %s',
        'https://github.com/jaredhanson/oauth2orize#register-exchanges'
      )

      server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, done) {
        validateScope(scopes, ares.scope)

        return grant(client, redirectUri, user, ares, done)
      }))

      server.exchange(oauth2orize.exchange.code(exchange))

      return
    }

    if (grantType === 'token') {
      invariant(
        typeof grant === 'function',
        'Option "grant.token" must be a function: %s',
        'https://github.com/jaredhanson/oauth2orize#register-grants'
      )

      server.grant(oauth2orize.grant.token(function (client, user, ares, done) {
        validateScope(scopes, ares.scope)

        return grant(client, user, ares, done)
      }))

      return
    }

    if (grantType === 'owner') {
      invariant(
        typeof exchange === 'function',
        'Option "exchange.owner" must be a function: %s',
        'https://github.com/jaredhanson/oauth2orize#register-grants'
      )

      server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
        validateScope(scopes, scope)

        return exchange(client, username, password, scope, done)
      }))

      return
    }

    if (grantType === 'credentials') {
      invariant(
        typeof exchange === 'function',
        'Option "exchange.credentials" must be a function: %s',
        'https://github.com/jaredhanson/oauth2orize#register-grants'
      )

      server.exchange(oauth2orize.exchange.clientCredentials(function (client, scope, done) {
        validateScope(scopes, scope)

        return exchange(client, scope, done)
      }))

      return
    }

    throw new TypeError('Unknown grant "' + key + '" type: ' + grantType)
  })

  var refreshToken = options.exchange.refresh

  // Refresh tokens are optional.
  if (typeof refreshToken === 'function') {
    server.exchange(oauth2orize.exchange.refreshToken(refreshToken))
  }

  var authenticate = [
    passport.initialize(),
    passport.authenticate(BEARER_KEY, { session: false, failWithError: true })
  ]

  /**
   * OAuth 2.0 authentication handler creator.
   *
   * @param  {Object}   options
   * @return {Function}
   */
  function handler (options) {
    if (!options) {
      return authenticate
    }

    // Return with scope validation.
    return authenticate.concat(scope(options.scopes))
  }

  return { router: app, handler: handler }
}

/**
 * Basic authentication handler.
 *
 * @param  {Object} scheme
 * @param  {Object} options
 * @param  {String} key
 * @return {Object}
 */
function createBasicAuthHandler (scheme, options, key) {
  var KEY = 'osprey:' + key

  invariant(
    typeof options.validateUser === 'function',
    'Option "validateUser" should be a function: %s',
    'https://github.com/jaredhanson/passport-http#usage-of-http-basic'
  )

  passport.use(KEY, new BasicStrategy(
    { realm: options.realm },
    options.validateUser
  ))

  var authenticate = [
    passport.initialize(),
    passport.authenticate(KEY, { session: false, failWithError: true })
  ]

  return {
    handler: function () { return authenticate }
  }
}

/**
 * Digest authentication handler.
 *
 * @param  {Object} scheme
 * @param  {Object} options
 * @param  {String} key
 * @return {Object}
 */
function createDigestAuthHandler (scheme, options, key) {
  var KEY = 'osprey:' + key

  invariant(
    typeof options.findUserByUsername === 'function',
    'Option "findUserByUsername" should be a function: %s',
    'https://github.com/jaredhanson/passport-http#usage-of-http-digest'
  )

  passport.use(KEY, new DigestStrategy(
    { qop: 'auth', realm: options.realm, domain: options.domain },
    options.findUserByUsername
  ))

  var authenticate = [
    passport.initialize(),
    passport.authenticate(KEY, { session: false, failWithError: true })
  ]

  return {
    handler: function () { return authenticate }
  }
}

/**
 * Check a path is valid against a url.
 *
 * @param  {String}  str
 * @param  {String}  value
 * @return {Boolean}
 */
function validPathEnding (url, path) {
  return path.charAt(0) === '/' && url.slice(-path.length) === path
}

/**
 * Validate the scopes are all correct.
 *
 * @param  {Array} scopes
 * @param  {Array} requestedScopes
 * @return {Array}
 */
function validateScope (scopes, requestedScopes) {
  if (scopes.length) {
    for (var i = 0; i < requestedScopes.length; i++) {
      if (scopes.indexOf(requestedScopes[i]) === -1) {
        throw new oauth2orize.TokenError('Unknown scope: ' + requestedScopes[i], 'invalid_request')
      }
    }
  }
}

/**
 * Add `query` property when server does not already support it.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
function attachQuery (req, res, next) {
  if (req.query) {
    return next()
  }

  // Parse querystring for OAuth2orize.
  req.query = querystring.parse(parseurl(req).query)

  return next()
}

/**
 * Attach a redirect function when the server does not support it already.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
function attachRedirect (req, res, next) {
  if (res.redirect) {
    return next()
  }

  // Do HTTP redirects.
  res.redirect = redirect

  return next()
}

/**
 * Redirection function for `http#Response`.
 *
 * @param {String} location
 */
function redirect (location) {
  this.statusCode = 302
  this.setHeader('Location', location)
  this.setHeader('Content-Length', '0')
  this.end()
}

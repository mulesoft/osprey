const urllib = require('url')
const parseurl = require('parseurl')
const querystring = require('querystring')
const oauth2orize = require('oauth2orize')
const invariant = require('invariant')
const passport = require('passport')
const cookieSession = require('cookie-session')
const BasicStrategy = require('passport-http').BasicStrategy
const DigestStrategy = require('passport-http').DigestStrategy
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const extend = require('xtend')
const bodyParser = require('body-parser')
const arrify = require('arrify')
const ospreyRouter = require('osprey-router')

const scope = require('./scope')

/**
 * Expose handler.
 */
module.exports = createHandler

/**
 * Create a handler object from an object of RAML security scheme options.
 *
 * @param  {webapi-parser.SecurityScheme} scheme
 * @param  {Object} options
 * @param  {String} key
 * @return {Object}
 */
function createHandler (scheme, options, key) {
  // Allow functions to override any other options.
  if (typeof options === 'function') {
    return options(scheme, key)
  }

  const schemeType = scheme.type.value()
  if (schemeType === 'OAuth 2.0') {
    return createOAuth2Handler(scheme, options, key)
  }

  if (schemeType === 'Basic Authentication') {
    return createBasicAuthHandler(options, key)
  }

  if (schemeType === 'Digest Authentication') {
    return createDigestAuthHandler(options, key)
  }

  throw new TypeError(
    'To enable ' + schemeType + ', you must provide a function as the ' +
    'option. The function must return an object with a handler method and, ' +
    'optionally, a middleware function (e.g. using `osprey-router`).'
  )
}

/**
 * Create a handler for OAuth 2.0.
 *
 * @param  {webapi-parser.SecurityScheme} scheme
 * @param  {Object} opts
 * @param  {String} key
 * @return {Object}
 */
function createOAuth2Handler (scheme, opts, key) {
  const app = ospreyRouter()
  const server = oauth2orize.createServer()
  const settings = scheme.settings
  const options = extend({ grant: {}, exchange: {} }, opts)
  const scopes = settings.scopes
    ? settings.scopes.map(s => s.name.value())
    : []
  const authorizationGrants = settings.authorizationGrants
    ? settings.authorizationGrants.map(s => s.value())
    : []

  const BASIC_KEY = 'osprey:' + key + ':basic'
  const CLIENT_PASSWORD_KEY = 'osprey:' + key + 'oauth2-client-password'
  const BEARER_KEY = 'osprey:' + key + ':bearer'

  invariant(
    authorizationGrants.length > 0,
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

  const accessTokenUriObj = new urllib.URL(
    options.accessTokenUri ||
    settings.accessTokenUri.option)
  const accessTokenUri = accessTokenUriObj.pathname + accessTokenUriObj.search

  // Body parsing middleware for OAuth 2.0 routes.
  const parseBody = [bodyParser.json(), bodyParser.urlencoded({ extended: false })]

  invariant(
    validPathEnding(settings.accessTokenUri.option, accessTokenUri),
    '`accessTokenUri` must match the suffix of the RAML `accessTokenUri` setting'
  )

  // Skip authorization page logic if not required.
  if (
    authorizationGrants.indexOf('code') > -1 ||
    authorizationGrants.indexOf('token') > -1
  ) {
    const serializeClient = options.serializeClient
    const deserializeClient = options.deserializeClient
    const sessionKeys = options.sessionKeys
    const ensureLoggedIn = options.ensureLoggedIn
    const authorizeClient = options.authorizeClient
    const serveAuthorizationPage = options.serveAuthorizationPage
    const immediateAuthorization = options.immediateAuthorization
    const authorizationUriObj = new urllib.URL(
      options.authorizationUri ||
      settings.authorizationUri.option)
    const authorizationUri = authorizationUriObj.pathname + authorizationUriObj.search

    invariant(
      validPathEnding(settings.authorizationUri.option, authorizationUri),
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
    const session = cookieSession({
      name: 'osprey-' + key,
      keys: options.sessionKeys
    })

    // Authorize client validation.
    const validate = function (clientId, redirectUri, scope, type, done) {
      validateScope(scopes, scope)

      return authorizeClient(clientId, redirectUri, scope, type, done)
    }

    // Set up immediate function. Wrap it for consistent arity.
    const immediate = immediateAuthorization ? (client, user, scope, done) => {
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
      server.decision((req, done) => {
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

  authorizationGrants.forEach(grantType => {
    const grant = options.grant[grantType]
    const exchange = options.exchange[grantType]

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

      server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
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

      server.grant(oauth2orize.grant.token((client, user, ares, done) => {
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

      server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
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

      server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
        validateScope(scopes, scope)

        return exchange(client, scope, done)
      }))

      return
    }

    throw new TypeError('Unknown grant "' + key + '" type: ' + grantType)
  })

  const refreshToken = options.exchange.refresh

  // Refresh tokens are optional.
  if (typeof refreshToken === 'function') {
    server.exchange(oauth2orize.exchange.refreshToken(refreshToken))
  }

  const authenticate = [
    passport.initialize(),
    passport.authenticate(BEARER_KEY, { session: false, failWithError: true })
  ]

  /**
   * OAuth 2.0 authentication handler creator.
   *
   * @param  {webapi-parser.Settings}   schemeParams
   * @return {Function}
   */
  function handler (schemeParams) {
    if (!schemeParams) {
      return authenticate
    }

    // Return with scope validation.
    const scopes = schemeParams.scopes
      ? schemeParams.scopes.map(s => s.name.value())
      : []
    return authenticate.concat(scope(scopes))
  }

  return { router: app, handler: handler }
}

/**
 * Basic authentication handler.
 *
 * @param  {Object} options
 * @param  {String} key
 * @return {Object}
 */
function createBasicAuthHandler (options, key) {
  const KEY = 'osprey:' + key

  invariant(
    typeof options.validateUser === 'function',
    'Option "validateUser" should be a function: %s',
    'https://github.com/jaredhanson/passport-http#usage-of-http-basic'
  )

  passport.use(KEY, new BasicStrategy(
    { realm: options.realm, passReqToCallback: options.passReqToCallback },
    options.validateUser
  ))

  const authenticate = [
    passport.initialize(),
    passport.authenticate(KEY, { session: false, failWithError: true })
  ]

  return {
    handler: () => { return authenticate }
  }
}

/**
 * Digest authentication handler.
 *
 * @param  {Object} options
 * @param  {String} key
 * @return {Object}
 */
function createDigestAuthHandler (options, key) {
  const KEY = 'osprey:' + key

  invariant(
    typeof options.findUserByUsername === 'function',
    'Option "findUserByUsername" should be a function: %s',
    'https://github.com/jaredhanson/passport-http#usage-of-http-digest'
  )

  passport.use(KEY, new DigestStrategy(
    { qop: 'auth', realm: options.realm, domain: options.domain },
    options.findUserByUsername
  ))

  const authenticate = [
    passport.initialize(),
    passport.authenticate(KEY, { session: false, failWithError: true })
  ]

  return {
    handler: () => { return authenticate }
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
    for (let i = 0; i < requestedScopes.length; i++) {
      if (scopes.indexOf(requestedScopes[i]) === -1) {
        throw new oauth2orize.TokenError(
          'Unknown scope: ' + requestedScopes[i], 'invalid_request')
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

var arrify = require('arrify')
var TokenError = require('oauth2orize').TokenError

/**
 * Export scope middleware.
 */
module.exports = enforceScope

/**
 * Create a middleware function for enforcing a scope on an endpoint.
 *
 * @param  {String|Array<String>} scope
 * @return {Function}
 */
function enforceScope (scope) {
  var scopes = arrify(scope)

  if (scopes.length === 0) {
    throw new TypeError('Expected a scope or array of scopes, but got: ' + scope)
  }

  return function scope (req, res, next) {
    var userScopes = arrify(req.authInfo.scope)

    // Find one scope the user has and authorize access.
    for (var i = 0; i < scopes.length; i++) {
      if (userScopes.indexOf(scopes[i]) > -1) {
        return next()
      }
    }

    return next(new TokenError('User unsupported scope: ' + scopes, 'invalid_scope'))
  }
}

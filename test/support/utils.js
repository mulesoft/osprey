var http = require('http')
var finalhandler = require('finalhandler')

/**
 * Expose utilities.
 */
exports.createServer = createServer
exports.response = response

/**
 * Create a HTTP server from middleware.
 *
 * @param  {Function} router
 * @return {Function}
 */
function createServer (router) {
  return http.createServer(function (req, res) {
    return router(req, res, finalhandler(req, res))
  })
}

/**
 * Respond to a HTTP request with a certain value.
 *
 * @param  {*}        value
 * @return {Function}
 */
function response (value, contentType) {
  return function success (req, res) {
    res.writeHead(200, { 'Content-Type': contentType || 'text/plain' })
    res.end(value)
  }
}

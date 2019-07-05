var http = require('http')
var finalhandler = require('finalhandler')

/**
 * Expose utilities.
 */
exports.createServer = createServer
exports.response = response
exports.makeFetcher = makeFetcher

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

/* Helps using popsicle-server with popsicle version 12+.
 *
 * Inspired by popsicle 12.0+ code.
 */
function makeFetcher (...mware) {
  var compose = require('throwback').compose
  var Request = require('servie').Request
  var popsicle = require('popsicle')

  // Set response text to "body" property to mimic popsicle v10
  // response interface.
  function responseBodyMiddleware (req, next) {
    return next().then(res => {
      return res.text().then(body => {
        res.body = body
        return res
      })
    })
  }

  var middleware = [responseBodyMiddleware, ...mware, popsicle.middleware]

  return {
    fetch: popsicle.toFetch(compose(middleware), Request)
  }
}

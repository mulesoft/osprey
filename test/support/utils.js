const http = require('http')
const finalhandler = require('finalhandler')

/**
 * Expose utilities.
 */
exports.createServer = createServer
exports.response = response
exports.makeFetcher = makeFetcher
exports.basicAuth = basicAuth

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
  const compose = require('throwback').compose
  const Request = require('servie').Request
  const popsicle = require('popsicle')

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

  const middleware = [responseBodyMiddleware, ...mware, popsicle.middleware]

  return {
    fetch: popsicle.toFetch(compose(middleware), Request)
  }
}

/* Rework of popsicle-basic-auth/popsicle-basic-auth.js to work with popsicle 12 */
function basicAuth (username, password) {
  const encode = typeof window === 'object' ? window.btoa : function (str) {
    return Buffer.from(str).toString('base64')
  }
  const authorization = 'Basic ' + encode(username + ':' + password)

  return function (req, next) {
    req.headers.set('Authorization', authorization)

    return next()
  }
}

var http = require('http')
var https = require('https')
var arrify = require('arrify')
var querystring = require('querystring')
var is = require('type-is')
var url = require('url')
var FormData = require('form-data')
var compose = require('compose-middleware').compose

/**
 * Expose `createProxy`.
 */
module.exports = createProxy

/**
 * Turn Osprey into a proxy.
 *
 * @param  {Function} middleware
 * @param  {Array}    addresses
 * @return {Function}
 */
function createProxy (middleware, addresses) {
  var fns = []

  var addrs = arrify(addresses).map(function (address) {
    var addr = url.format(address)

    // Remove any trailing slashes from the address.
    addr = addr.replace(/\/$/, '')

    return /^\w+:\/\//.test(addr) ? addr : 'http://' + addr
  })

  fns.push(middleware)

  fns.push(function proxyAddress (req, res, next) {
    var addr = addrs.shift()
    var opts = url.parse(addr + req.url)

    // Push the address back onto the array.
    addrs.push(addr)

    // Proxy request headers (minus now invalid content-length).
    opts.method = req.method
    opts.headers = req.headers

    if (req.form) {
      var formData = new FormData()

      req.form.on('file', function (name, stream, filename, encoding, type) {
        formData.append(name, stream, {
          filename: filename,
          contentType: type
        })
      })

      req.form.on('field', function (name, value) {
        formData.append(name, value)
      })

      req.form.on('finish', function () {
        // Remove the old `Content-Type` header which has an invalid boundary.
        delete req.headers['content-type']
        delete req.headers['content-length']

        // Add form data boundary and content length headers.
        opts.headers = formData.getHeaders(req.headers)

        return formData.pipe(proxyRequest(opts, res, next))
      })

      req.form.on('error', next)

      return req.pipe(req.form)
    }

    var proxy = proxyRequest(opts, res, next)

    if (req.body) {
      var body = ''

      if (is(req, 'urlencoded')) {
        body = querystring.stringify(req.body)
      } else if (is(req, 'json')) {
        body = JSON.stringify(req.body)
      } else {
        // Support XML throughput.
        body = req.body
      }

      opts.headers['content-length'] = String(Buffer.byteLength(body))
      proxy.write(body)
      proxy.end()
      return
    }

    return req._readableState.ended ? proxy.end() : req.pipe(proxy)
  })

  return createHttpHandler(compose(fns))
}

/**
 * Create the proxy request.
 *
 * @param  {Object}   opts
 * @param  {Stream}   writableStream
 * @param  {Function} cb
 * @return {Stream}
 */
function proxyRequest (opts, writableStream, errCb) {
  var engine = opts.protocol === 'https:' ? https : http

  var proxy = engine.request(opts, function (response) {
    response.pipe(writableStream)
  })

  proxy.on('error', errCb)

  return proxy
}

/**
 * Create a http handler.
 *
 * @param  {Function} app
 * @return {Function}
 */
function createHttpHandler (app) {
  var finalhandler = require('finalhandler')

  return http.createServer(function (req, res) {
    return app(req, res, finalhandler(req, res))
  })
}

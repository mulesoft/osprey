const http = require('http')
const https = require('https')
const arrify = require('arrify')
const querystring = require('querystring')
const is = require('type-is')
const url = require('url')
const FormData = require('form-data')
const compose = require('compose-middleware').compose

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
  const fns = []

  const addrs = arrify(addresses).map(address => {
    let addr = url.format(address)

    // Remove any trailing slashes from the address.
    addr = addr.replace(/\/$/, '')

    return /^\w+:\/\//.test(addr) ? addr : 'http://' + addr
  })

  fns.push(middleware)

  fns.push(function proxyAddress (req, res, next) {
    const addr = addrs.shift()
    const urlObj = new url.URL(addr + req.url)
    const opts = {
      protocol: urlObj.protocol,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      auth: urlObj.auth || (urlObj.username + ':' + urlObj.password)
    }

    // Push the address back onto the array.
    addrs.push(addr)

    // Proxy request headers (minus now invalid content-length).
    opts.method = req.method
    opts.headers = req.headers

    if (req.form) {
      const formData = new FormData()

      req.form.on('file', (name, stream, filename, encoding, type) => {
        formData.append(name, stream, {
          filename: filename,
          contentType: type
        })
      })

      req.form.on('field', (name, value) => {
        formData.append(name, value)
      })

      req.form.on('finish', () => {
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

    const proxy = proxyRequest(opts, res, next)

    if (req.body) {
      let body = ''

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
 * @param  {url.URL}   opts
 * @param  {Stream}   writableStream
 * @param  {Function} cb
 * @return {Stream}
 */
function proxyRequest (opts, writableStream, errCb) {
  const engine = opts.protocol === 'https:' ? https : http

  const proxy = engine.request(opts, response => {
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
  const finalhandler = require('finalhandler')

  return http.createServer((req, res) => {
    return app(req, res, finalhandler(req, res))
  })
}

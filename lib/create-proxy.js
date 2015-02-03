/**
 * Expose `createProxy`.
 */
module.exports = createProxy;

/**
 * Turn Osprey into a proxy.
 *
 * @param  {Function} middleware
 * @param  {Array}    addresses
 * @return {Function}
 */
function createProxy (middleware, addresses) {
  // Require dependencies inline to avoid overhead when not using the proxy.
  var app = require('osprey-router')();
  var qs = require('querystring');
  var is = require('type-is');
  var url = require('url');
  var http = require('http');
  var https = require('https');
  var FormData = require('form-data');

  var addrs = array(addresses).map(function (address) {
    var addr = url.format(address);

    return /^\w+\:/.test(addr) ? addr : 'http://' + addr;
  });

  app.use(middleware);

  app.use(function proxyAddress (req, res, next) {
    var addr = addrs.shift();
    var engine = /^https\:/.test(addr) ? https : http;
    var opts = url.parse(url.resolve(addr, req.url));

    // Proxy request headers (minus now invalid content-length).
    opts.method = req.method;
    opts.headers = req.headers;

    if (req.form) {
      var formData = new FormData();

      req.form.on('file', function (name, stream, filename, encoding, type) {
        formData.append(name, stream, {
          filename: filename,
          contentType: type
        });
      });

      req.form.on('field', function (name, value) {
        formData.append(name, value);
      });

      req.form.on('finish', function () {
        // Remove the old `Content-Type` header which has an invalid boundary.
        delete req.headers['content-type'];
        delete req.headers['content-length'];

        // Add form data boundary and content length headers.
        opts.headers = formData.getHeaders(req.headers);

        return formData.pipe(request(opts));
      });

      req.form.on('error', next);

      return req.pipe(req.form);
    }

    var body = '';

    if (req.body) {
      if (is(req, 'urlencoded')) {
        body = qs.stringify(req.body);
      } else if (is(req, 'json')) {
        body = JSON.stringify(req.body);
      } else {
        // Support XML throughput.
        body = req.body;
      }

      opts.headers['content-length'] = String(Buffer.byteLength(body));
    } else {
      body = '';
      opts.headers['content-length'] = '0';
    }

    var proxy = request(opts);
    proxy.write(body);
    proxy.end();

    function request (opts) {
      var proxy = engine.request(opts, function (response) {
        response.pipe(res);
      });

      proxy.on('error', next);

      return proxy;
    }

    addrs.push(addr);
  });

  return createHttpHandler(app);
}

/**
 * To array.
 *
 * @param  {Array} value
 * @return {Array}
 */
function array (value) {
  return Array.isArray(value) ? value : [value];
}

/**
 * Create a http handler.
 *
 * @param  {Function} app
 * @return {Function}
 */
function createHttpHandler (app) {
  var finalhandler = require('finalhandler');

  function httpHandler (req, res) {
    return app(req, res, finalhandler(req, res));
  }

  httpHandler.listen = function (port, cb) {
    return require('http').createServer(httpHandler).listen(port, cb);
  };

  return httpHandler;
}

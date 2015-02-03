var router = require('osprey-router');
var resources = require('osprey-resources');

/**
 * Expose `createServer`.
 */
module.exports = createServer;

function createServer (raml, options, done) {
  return createDocumentation(raml, options, function (err, html) {
    if (err) {
      return done(err);
    }

    var app = router();

    if (html) {
      app.get(options.documentationPath, serveHtml(html));
    }

    app.use(resources(raml.resources));

    return done(null, app);
  });
}

/**
 * Create documentation for the application.
 *
 * @param  {Object}   raml
 * @param  {Object}   options
 * @return {Function}
 */
function createDocumentation (raml, options, done) {
  var documentationPath = options.documentationPath;

  // Don't mount documentation.
  if (!documentationPath) {
    return done();
  }

  var raml2html = require('raml2html');
  var config = raml2html.getDefaultConfig(true);

  return raml2html.render(raml, config, function (html) {
    return done(null, html);
  }, done);
}

/**
 * Serve html to a http request.
 *
 * @param  {String}   html
 * @return {Function}
 */
function serveHtml (html) {
  var contentLength = Buffer.byteLength(html);

  return function (req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Length', contentLength);
    res.end(html);
  };
}

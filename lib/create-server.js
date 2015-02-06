var router = require('osprey-router');
var resources = require('osprey-resources');

/**
 * Expose `createServer`.
 */
module.exports = createServer;

/**
 * Create server middleware.
 *
 * @param  {Object}   raml
 * @param  {Object}   [options]
 * @return {Function}
 */
function createServer (raml) {
  var app = router();

  app.use(resources(raml.resources));

  return app;
}

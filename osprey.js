var createServer = require('./lib/create-server');
var createProxy = require('./lib/create-proxy');

/**
 * Expose the router.
 */
exports.Router = require('osprey-router');

/**
 * Expose creating a server from a JavaScript object.
 */
exports.createServer = createServer;

/**
 * Expose creating a proxy using an Osprey instance.
 */
exports.createProxy = createProxy;

/**
 * Load an Osprey server directly from a RAML file.
 *
 * @param  {String}  path
 * @param  {Object}  options
 * @return {Promise}
 */
exports.loadFile = function (path, options) {
  return require('raml-parser').loadFile(path)
    .then(function (raml) {
      return createServer(raml, options);
    });
};

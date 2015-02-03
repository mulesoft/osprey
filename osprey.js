var RAML = require('raml-parser');
var createServer = require('./lib/create-server');
var createProxy = require('./lib/create-proxy');

/**
 * Expose `osprey`.
 */
module.exports = osprey;

/**
 * Expose the router.
 */
module.exports.Router = require('osprey-router');

/**
 * Expose create a server from a JavaScript object.
 */
module.exports.createServer = createServer;

/**
 * Expose creating a proxy using an Osprey instance.
 */
module.exports.createProxy = createProxy;

/**
 * Generate an Osprey server instance.
 *
 * @param {String}   filename
 * @param {Object}   options
 * @param {Function} done
 */
function osprey (filename, options, done) {
  if (typeof options === 'function') {
    done = options;
    options = {};
  }

  RAML.loadFile(filename)
    .then(function (raml) {
      return createServer(raml, options, done);
    })
    .catch(done);
}

var createServer = require('./lib/create-server');
var createProxy = require('./lib/create-proxy');

/**
 * Expose the router.
 */
module.exports.Router = require('osprey-router');

/**
 * Expose creating a server from a JavaScript object.
 */
module.exports.createServer = createServer;

/**
 * Expose creating a proxy using an Osprey instance.
 */
module.exports.createProxy = createProxy;

var parseurl = require('parseurl')
var router = require('osprey-router')
var resources = require('osprey-resources')
var handler = require('osprey-method-handler')
var createError = require('http-errors')

/**
 * Expose `createServer`.
 */
module.exports = createServer

/**
 * Create server middleware.
 *
 * @param  {Object}   raml
 * @param  {Object}   options
 * @return {Function}
 */
function createServer (raml, opts) {
  var app = router()
  var options = opts || {}
  var corsOpts = typeof options.cors === 'boolean' ? undefined : options.cors

  if (options.cors) {
    var cors = require('cors')

    app.options('*', cors(corsOpts))
    app.use(cors(corsOpts))
  }

  if (options.compression !== false) {
    var compression = require('compression')

    app.use(compression())
  }

  app.use(resources(raml.resources, function (schema, path) {
    return handler(schema, path, schema.method, options)
  }))

  app.use(function (req, res, next) {
    // Check for existence of the method handler.
    if (req.resourcePath) {
      return next()
    }

    return next(
      new createError.NotFound(
        'Path ' + parseurl(req).pathname +
        ' was not found in the RAML file for this application.'
      )
    )
  })

  return app
}

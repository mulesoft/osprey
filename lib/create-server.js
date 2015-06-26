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
 * @return {Function}
 */
function createServer (raml) {
  var app = router()

  app.use(resources(raml.resources, handler))

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

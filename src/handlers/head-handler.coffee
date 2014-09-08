HttpUtils = require '../utils/http-utils'
helper = require '../utils/handler-utils'
logger = require '../utils/logger'

class MockHeadHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - HEAD #{req.url}"

    @setDefaultHeaders res, methodInfo

    res.send @readStatusCode methodInfo

class HeadHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handlers) =>
    helper.resolveWithMiddlewares 'head', @context, "#{@apiPath}#{uriTemplate}", handlers, (handler) => 
      (req, res, next) =>
        handler req, res

exports.MockHandler = MockHeadHandler
exports.Handler = HeadHandler

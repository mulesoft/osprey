HttpUtils = require '../utils/http-utils'
helper = require '../utils/handler-utils'
logger = require '../utils/logger'

class MockDeleteHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - DELETE #{req.url}"
    @setDefaultHeaders res, methodInfo
    res.send @readStatusCode(methodInfo)

class DeleteHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->
    
  resolve: (uriTemplate, handlers) =>
    helper.resolveWithMiddlewares 'delete', @context, "#{@apiPath}#{uriTemplate}", handlers, (handler) => 
      (req, res, next) =>
        handler req, res

exports.MockHandler = MockDeleteHandler
exports.Handler = DeleteHandler

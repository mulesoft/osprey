HttpUtils = require '../utils/http-utils'
logger = require '../utils/logger'

class MockDeleteHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - DELETE #{req.url}"
    @setDefaultHeaders res, methodInfo
    res.send @readStatusCode(methodInfo)

class DeleteHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"
    
    @context.delete template, (req, res) ->
      handler req, res

exports.MockHandler = MockDeleteHandler
exports.Handler = DeleteHandler

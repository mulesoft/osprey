HttpUtils = require '../utils/http-utils'
helper = require '../utils/handler-utils'
logger = require '../utils/logger'

class MockPostHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - POST #{req.url}"
    @setDefaultHeaders res, methodInfo
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, next, methodInfo

class PostHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handlers) =>
    helper.resolveWithMiddlewares 'post', @context, "#{@apiPath}#{uriTemplate}", handlers, (handler) =>
      (req, res, next) =>
        methodInfo = @methodLookup @resources, 'post', uriTemplate
        @negotiateContentType req, res, methodInfo
        @negotiateAcceptType req, res, next, methodInfo, handler

exports.MockHandler = MockPostHandler
exports.Handler = PostHandler

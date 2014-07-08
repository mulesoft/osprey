HttpUtils = require '../utils/http-utils'
logger = require '../utils/logger'

class MockPostHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - POST #{req.url}"
    @setDefaultHeaders res, methodInfo
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, next, methodInfo

class PostHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"

    @context.post template, (req, res, next) =>
      methodInfo = @methodLookup @resources, 'post', uriTemplate
      @negotiateContentType req, res, methodInfo
      @negotiateAcceptType req, res, next, methodInfo, handler

exports.MockHandler = MockPostHandler
exports.Handler = PostHandler

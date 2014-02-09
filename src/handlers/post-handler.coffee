HttpUtils = require '../utils/http-utils'
OspreyBase = require '../utils/base'
logger = require '../utils/logger'

class MockPostHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    logger.debug "Mock resolved - POST #{req.url}"
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, methodInfo

class PostHandler extends OspreyBase
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"

    @context.post template, (req, res) =>
      methodInfo = @methodLookup @resources, 'post', uriTemplate
      @negotiateContentType req, res, methodInfo
      @negotiateAcceptType req, res, methodInfo, handler

exports.MockHandler = MockPostHandler
exports.Handler = PostHandler

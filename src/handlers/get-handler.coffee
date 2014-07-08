HttpUtils = require '../utils/http-utils'
logger = require '../utils/logger'

class MockGetHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - GET #{req.url}"
    @setDefaultHeaders res, methodInfo
    @negotiateAcceptType req, res, next, methodInfo

class GetHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"

    @context.get template, (req, res, next) =>
      methodInfo = @methodLookup @resources, 'get', uriTemplate
      @negotiateAcceptType req, res, next, methodInfo, handler

exports.MockHandler = MockGetHandler
exports.Handler = GetHandler

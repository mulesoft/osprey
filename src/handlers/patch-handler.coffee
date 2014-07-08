HttpUtils = require '../utils/http-utils'
logger = require '../utils/logger'

class MockPatchHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - PATCH #{req.url}"
    @setDefaultHeaders res, methodInfo
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, next, methodInfo

class PatchHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"

    @context.patch template, (req, res, next) =>
      methodInfo = @methodLookup @resources, 'patch', uriTemplate
      @negotiateContentType req, res, methodInfo
      @negotiateAcceptType req, res, next, methodInfo, handler

exports.MockHandler = MockPatchHandler
exports.Handler = PatchHandler

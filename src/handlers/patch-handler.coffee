HttpUtils = require '../utils/http-utils'
OspreyBase = require '../utils/base'
logger = require '../utils/logger'

class MockPatchHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    logger.debug "Mock resolved - PATCH #{req.url}"
    @setDefaultHeaders res, methodInfo
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, methodInfo

class PatchHandler extends OspreyBase
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"

    @context.patch template, (req, res) =>
      methodInfo = @methodLookup @resources, 'patch', uriTemplate
      @negotiateContentType req, res, methodInfo
      @negotiateAcceptType req, res, methodInfo, handler

exports.MockHandler = MockPatchHandler
exports.Handler = PatchHandler

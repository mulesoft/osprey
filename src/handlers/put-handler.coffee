HttpUtils = require '../utils/http-utils'
OspreyBase = require '../utils/base'
logger = require '../utils/logger'

class MockPutHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    logger.debug "Mock resolved - PUT #{req.url}"
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, methodInfo

class PutHandler extends OspreyBase
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"

    @context.put template, (req, res) =>
      methodInfo = @methodLookup @resources, 'put', uriTemplate
      @negotiateContentType req, res, methodInfo
      @negotiateAcceptType req, res, methodInfo, handler

exports.MockHandler = MockPutHandler
exports.Handler = PutHandler

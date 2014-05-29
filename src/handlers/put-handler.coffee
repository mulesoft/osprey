HttpUtils = require '../utils/http-utils'
logger = require '../utils/logger'

class MockPutHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    logger.debug "Mock resolved - PUT #{req.url}"
    @setDefaultHeaders res, methodInfo
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, methodInfo

class PutHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    @context.put uriTemplate, (req, res) =>
      methodInfo = @methodLookup @resources, 'put', uriTemplate
      @negotiateContentType req, res, methodInfo
      @negotiateAcceptType req, res, methodInfo, handler

exports.MockHandler = MockPutHandler
exports.Handler = PutHandler

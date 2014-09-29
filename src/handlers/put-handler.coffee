HttpUtils = require '../utils/http-utils'
helper = require '../utils/handler-utils'
logger = require '../utils/logger'

class MockPutHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - PUT #{req.url}"
    @setDefaultHeaders res, methodInfo
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, next, methodInfo

class PutHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handlers) =>
    helper.resolveWithMiddlewares 'put', @context, "#{@apiPath}#{uriTemplate}", handlers, (handler) =>
      (req, res, next) =>
        methodInfo = @methodLookup @resources, 'put', uriTemplate
        @negotiateContentType req, res, methodInfo
        @negotiateAcceptType req, res, next, methodInfo, handler

exports.MockHandler = MockPutHandler
exports.Handler = PutHandler

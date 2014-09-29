HttpUtils = require '../utils/http-utils'
helper = require '../utils/handler-utils'
logger = require '../utils/logger'

class MockGetHandler extends HttpUtils
  resolve: (req, res, next, methodInfo) ->
    logger.debug "Mock resolved - GET #{req.url}"
    @setDefaultHeaders res, methodInfo
    @negotiateAcceptType req, res, next, methodInfo

class GetHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handlers) =>
    helper.resolveWithMiddlewares 'get', @context, "#{@apiPath}#{uriTemplate}", handlers, (handler) =>
      (req, res, next) =>
        methodInfo = @methodLookup @resources, 'get', uriTemplate
        @negotiateAcceptType req, res, next, methodInfo, handler

exports.MockHandler = MockGetHandler
exports.Handler = GetHandler

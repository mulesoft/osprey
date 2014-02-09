HttpUtils = require '../utils/http-utils'
OspreyBase = require '../utils/base'
logger = require '../utils/logger'

class MockGetHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    logger.debug "Mock resolved - GET #{req.url}"
    @negotiateAcceptType req, res, methodInfo

class GetHandler extends OspreyBase
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"

    @context.get template, (req, res) =>
      methodInfo = @methodLookup @resources, 'get', uriTemplate
      @negotiateAcceptType req, res, methodInfo, handler

exports.MockHandler = MockGetHandler
exports.Handler = GetHandler
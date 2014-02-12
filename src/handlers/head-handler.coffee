HttpUtils = require '../utils/http-utils'
OspreyBase = require '../utils/base'
logger = require '../utils/logger'

class MockHeadHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    logger.debug "Mock resolved - HEAD #{req.url}"
    res.send @readStatusCode(methodInfo)

class HeadHandler extends OspreyBase
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"
    
    @context.head template, (req, res) ->
      handler req, res

exports.MockHandler = MockHeadHandler
exports.Handler = HeadHandler

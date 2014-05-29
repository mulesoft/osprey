HttpUtils = require '../utils/http-utils'
logger = require '../utils/logger'

class MockHeadHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    logger.debug "Mock resolved - HEAD #{req.url}"

    @setDefaultHeaders res, methodInfo

    res.send @readStatusCode methodInfo

class HeadHandler extends HttpUtils
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    @context.head uriTemplate, (req, res) ->
      handler req, res

exports.MockHandler = MockHeadHandler
exports.Handler = HeadHandler

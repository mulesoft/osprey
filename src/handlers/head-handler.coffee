HttpUtils = require '../utils/http-utils'
ApiKitBase = require '../utils/base'

class MockHeadHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    res.send @readStatusCode(methodInfo)

class HeadHandler extends ApiKitBase
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    @context.head template, (req, res) ->
      handler req, res

exports.MockHandler = MockHeadHandler
exports.Handler = HeadHandler

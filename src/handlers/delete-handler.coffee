HttpUtils = require '../utils/http-utils'
ApiKitBase = require '../utils/base'

class MockDeleteHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    res.send @readStatusCode(methodInfo)

class DeleteHandler extends ApiKitBase
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    @context.delete template, (req, res) ->
      handler req, res

exports.MockHandler = MockDeleteHandler
exports.Handler = DeleteHandler

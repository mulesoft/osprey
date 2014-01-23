HttpUtils = require '../utils/http-utils'
ApiKitBase = require '../utils/base'

class MockGetHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    @negotiateAcceptType req, res, methodInfo

class GetHandler extends ApiKitBase
  constructor: (@apiPath, @context, @resources) ->

  resolve: (uriTemplate, handler) =>
    template = "#{@apiPath}#{uriTemplate}"

    @context.get template, (req, res) =>
      methodInfo = @methodLookup @resources, 'get', uriTemplate
      @negotiateAcceptType req, res, methodInfo, handler

exports.MockHandler = MockGetHandler
exports.Handler = GetHandler
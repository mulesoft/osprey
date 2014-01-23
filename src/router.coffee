GetMethod = require './handlers/get-handler'
PostMethod = require './handlers/post-handler'
PutMethod = require './handlers/put-handler'
DeleteMethod = require './handlers/delete-handler'
HeadMethod = require './handlers/head-handler'
ApiKitBase = require './utils/base'

class ApiKitRouter extends ApiKitBase
  constructor: (@apiPath, @context, @resources, @uriTemplateReader) ->
    @mockMethodHandlers =
      get: new GetMethod.MockHandler
      post: new PostMethod.MockHandler
      put: new PutMethod.MockHandler
      delete: new DeleteMethod.MockHandler
      head: new HeadMethod.MockHandler

    @methodHandlers =
      get: new GetMethod.Handler @apiPath, @context, @resources
      post: new PostMethod.Handler @apiPath, @context, @resources
      put: new PutMethod.Handler @apiPath, @context, @resources
      delete: new DeleteMethod.Handler @apiPath, @context, @resources
      head: new HeadMethod.Handler @apiPath, @context, @resources

  resolveMock: (req, res, next, enableMocks) =>
    uri = req.url.replace @apiPath, ''
    template = @uriTemplateReader.getTemplateFor uri
    method = req.method.toLowerCase()

    enableMocks = true unless enableMocks?

    if template? and not @routerExists method, req.url
      methodInfo = @methodLookup @resources, method, template.uriTemplate

      if methodInfo? and enableMocks
        @mockMethodHandlers[method].resolve req, res, methodInfo
        return

    next()

  routerExists: (httpMethod, uri) =>
    if @context.routes[httpMethod]?
      result = @context.routes[httpMethod].filter (route) ->
        uri.match(route.regexp)?.length

    result? and result.length is 1

  resolveMethod: (httpMethod, uriTemplate, handler) =>
    @methodHandlers[httpMethod].resolve uriTemplate, handler

module.exports = ApiKitRouter

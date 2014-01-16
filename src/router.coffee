GetHandler = require './handlers/get-handler'
PostHandler = require './handlers/post-handler'
PutHandler = require './handlers/put-handler'
DeleteHandler = require './handlers/delete-handler'
HeadHandler = require './handlers/head-handler'

class ApiKitRouter
  constructor: (@routes, @resources, @uriTemplateReader) ->
    @httpMethodHandlers =
      get: new GetHandler
      post: new PostHandler
      put: new PutHandler
      delete: new DeleteHandler
      head: new HeadHandler

  resolve: (apiPath, req, res, next) =>
    uri = req.url.replace apiPath, ''
    template = @uriTemplateReader.getTemplateFor uri
    method = req.method.toLowerCase()

    if template? and not @routerExists method, req.url
      methodInfo = @methodLookup method, template.uriTemplate

      if methodInfo?
        @httpMethodHandlers[method].resolve req, res, methodInfo
        return

    next()

  methodLookup: (httpMethod, uri) =>
    if @resources[uri]?.methods?
      methodInfo = @resources[uri].methods.filter (method) ->
        method.method == httpMethod

    if methodInfo? and methodInfo.length then methodInfo[0] else null

  routerExists: (httpMethod, uri) =>
    if @routes[httpMethod]?
      result = @routes[httpMethod].filter (route) ->
        uri.match(route.regexp)?.length

    result? and result.length is 1

module.exports = ApiKitRouter

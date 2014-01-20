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

  resolve: (apiPath, req, res, next, enableMocks) =>
    uri = req.url.replace apiPath, ''
    template = @uriTemplateReader.getTemplateFor uri
    method = req.method.toLowerCase()

    enableMocks = true unless enableMocks?

    if template? and not @routerExists method, req.url
      methodInfo = @methodLookup method, template.uriTemplate

      if methodInfo? and enableMocks
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

  readStatusCode: (methodInfo) ->
    statusCode = 200

    for key of methodInfo.responses
      statusCode = key
      break

    Number statusCode

  get: (app, apiPath, uriTemplate, handler) =>
    template = "#{apiPath}#{uriTemplate}"
  
    app.get template, (req, res) =>
      isValid = false
      methodInfo = @methodLookup 'get', uriTemplate
      statusCode = @readStatusCode methodInfo

      console.log methodInfo

      for mimeType of methodInfo.responses[statusCode].body
        if req.accepts(mimeType)
          res.set 'Content-Type', mimeType
          isValid = true
          break

      if not isValid && methodInfo.responses[statusCode].body?
        res.send 406
      else
        handler(req, res)
      # res.send(response || statusCode)
    
module.exports = ApiKitRouter

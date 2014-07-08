GetMethod = require '../handlers/get-handler'
PostMethod = require '../handlers/post-handler'
PutMethod = require '../handlers/put-handler'
DeleteMethod = require '../handlers/delete-handler'
HeadMethod = require '../handlers/head-handler'
PatchMethod = require '../handlers/patch-handler'
RamlHelper = require '../utils/raml-helper'

class OspreyRouter extends RamlHelper
  constructor: (@apiPath, @context, @settings, @resources, @uriTemplateReader, @logger) ->
    @logger.info 'Osprey::Router has been initialized successfully'

    @mockMethodHandlers =
      get: new GetMethod.MockHandler
      post: new PostMethod.MockHandler
      put: new PutMethod.MockHandler
      delete: new DeleteMethod.MockHandler
      head: new HeadMethod.MockHandler
      patch: new PatchMethod.MockHandler

    @methodHandlers =
      get: new GetMethod.Handler @apiPath, @context, @resources
      post: new PostMethod.Handler @apiPath, @context, @resources
      put: new PutMethod.Handler @apiPath, @context, @resources
      delete: new DeleteMethod.Handler @apiPath, @context, @resources
      head: new HeadMethod.Handler @apiPath, @context, @resources
      patch: new PatchMethod.Handler @apiPath, @context, @resources

    if @settings.handlers?
      for handler in @settings.handlers
        @resolveMethod handler

  exec: (req, res, next) =>
    if req.path.indexOf(@apiPath) >= 0
      @resolveMock req, res, next, @settings.enableMocks
    else
      next()

  resolveMock: (req, res, next, enableMocks) =>
    regex = new RegExp "^\\" + @apiPath + "(.*)"
    urlPath = regex.exec req.url

    if urlPath and urlPath.length > 1
      uri = urlPath[1].split('?')[0]
      reqUrl = req.url.split('?')[0]
      template = @uriTemplateReader.getTemplateFor uri
      method = req.method.toLowerCase()
      enableMocks = true unless enableMocks?

      if template? and not @routerExists method, reqUrl
        methodInfo = @methodLookup @resources, method, template.uriTemplate

        if methodInfo? and enableMocks
          @mockMethodHandlers[method].resolve req, res, next, methodInfo
          return

    next()

  routerExists: (httpMethod, uri) =>
    if @context.routes[httpMethod]?
      result = @context.routes[httpMethod].filter (route) ->
        uri.match(route.regexp)?.length

    result? and result.length is 1

  resolveMethod: (config) =>
    resourceExists = @resources[config.template]?.methods?.filter (info) -> info.method == config.method
    if resourceExists? and resourceExists.length > 0
      if config.handler
        @logger.debug "Overwritten resource - #{config.method.toUpperCase()} #{config.template}"
        @methodHandlers[config.method].resolve config.template, config.handler
      else
        @logger.error "Resource to overwrite does not have handlers defined - #{config.method.toUpperCase()} #{config.template}"
    else
      @logger.error "Resource to overwrite does not exists - #{config.method.toUpperCase()} #{config.template}"

module.exports = OspreyRouter

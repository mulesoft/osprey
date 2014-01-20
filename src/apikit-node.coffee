UriTemplateReader = require './uri-template-reader'
ApiKitRouter = require './router'
parser = require './wrapper'
express = require 'express'
Validation = require './validation/validation'
path = require 'path'

ramlEndpoint = (ramlPath) ->
  return (req, res) ->
    if req.accepts('application/raml+yaml')?
      res.sendfile ramlPath
    else
      res.send 406

route = (apiPath, ramlPath, routes, enableMocks) ->
  (req, res, next) ->
    if req.path.indexOf(apiPath) >= 0
      parser.loadRaml ramlPath, (wrapper) ->
        resources = wrapper.getResources()
        templates = wrapper.getUriTemplates()
        uriTemplateReader = new UriTemplateReader templates

        router = new ApiKitRouter routes, resources, uriTemplateReader
        router.resolve apiPath, req, res, next, enableMocks
    else
      next()

validations = (ramlPath, routes) ->
  (req, res, next) ->
    parser.loadRaml ramlPath, (wrapper) ->
      resources = wrapper.getResources()

      result = routes[req.method.toLowerCase()].filter (route) ->
        req.url.match(route.regexp)?.length

      if result.length
        resource = resources[result[0].path]

        templates = wrapper.getUriTemplates()

        uriTemplateReader = new UriTemplateReader templates

        validation = new Validation req, uriTemplateReader, resource
        if not validation.isValid()
          res.status('400')
          return

      next()

exports.register = (apiPath, context, settings) =>
  @context = context
  @apiPath = apiPath
  @settings = settings

  context.use route(apiPath, settings.ramlFile, context.routes, settings.enableMocks)

  settings.enableConsole = true unless settings.enableConsole?

  if settings.enableConsole
    context.use "#{apiPath}/console", express.static(path.join(__dirname, '/assets/console'))
    context.get apiPath, ramlEndpoint(settings.ramlFile)

exports.get = (uriTemplate, handler) =>
  parser.loadRaml @settings.ramlFile, (wrapper) =>
    resources = wrapper.getResources()
    templates = wrapper.getUriTemplates()
    uriTemplateReader = new UriTemplateReader templates
    
    router = new ApiKitRouter {}, resources, uriTemplateReader
    router.get @context, @apiPath, uriTemplate, handler

exports.route = route
exports.validations = validations

# TODO: Default Parameters should be exposed from here
# TODO: Exception Handling should be exposed from here

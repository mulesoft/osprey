UriTemplateReader = require './uri-template-reader'
ApiKitRouter = require './router'
parser = require './wrapper'
express = require 'express'
Validation = require './validation/validation'
path = require 'path'

class ApiKit
  constructor: (@apiPath, @context, @settings) ->

  register: =>
    @context.use @route(@apiPath, @settings.ramlFile, @context.routes, @settings.enableMocks)

    @settings.enableConsole = true unless @settings.enableConsole?

    if @settings.enableConsole
      @context.use "#{@apiPath}/console", express.static(path.join(__dirname, '/assets/console'))
      @context.get @apiPath, @ramlHandler(@settings.ramlFile)

  ramlHandler: (ramlPath) ->
    return (req, res) ->
      if req.accepts('application/raml+yaml')?
        res.sendfile ramlPath
      else
        res.send 406

  route: (enableMocks) =>
    (req, res, next) =>
      if req.path.indexOf(@apiPath) >= 0
        @readRaml (router) =>
          router.resolve @apiPath, req, res, next, @settings.enableMocks
      else
        next()

  get: (uriTemplate, handler) =>
    @readRaml (router) =>
      router.get @context, @apiPath, uriTemplate, handler

  readRaml: (callback) =>
    parser.loadRaml @settings.ramlFile, (wrapper) =>
      resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      uriTemplateReader = new UriTemplateReader templates

      callback new ApiKitRouter @context.routes, resources, uriTemplateReader

exports.register = (apiPath, context, settings) =>
  @apikit = new ApiKit(apiPath, context, settings)
  @apikit.register()

exports.route = (apiPath, context, settings) ->
  @apikit = new ApiKit(apiPath, context, settings)
  @apikit.route settings.enableMocks

exports.get = (uriTemplate, handler) =>
  @apikit.get uriTemplate, handler

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

exports.validations = validations

# TODO: Default Parameters should be exposed from here
# TODO: Exception Handling should be exposed from here

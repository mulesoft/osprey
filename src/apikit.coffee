UriTemplateReader = require './uri-template-reader'
ApiKitRouter = require './router'
parser = require './wrapper'
express = require 'express'
path = require 'path'
Validation = require './validation'

class ApiKit
  constructor: (@apiPath, @context, @settings) ->

  register: =>
    if @settings.enableValidations
      @context.use @validations()

    @context.use @route(@settings.enableMocks)

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
          router.resolveMock req, res, next, @settings.enableMocks
      else
        next()

  # TODO: refactor
  validations: () =>
    (req, res, next) =>
      @readRaml (router, uriTemplateReader, resources) =>
        uri = req.url.replace @apiPath, ''
        template = uriTemplateReader.getTemplateFor(uri)

        if template?
          resource = resources[template.uriTemplate]

          if resource?
            validation = new Validation req, uriTemplateReader, resource, @apiPath

            if req.path.indexOf(@apiPath) >= 0 and not validation.isValid()
              res.send 400
          
        next()

  get: (uriTemplate, handler) =>
    @readRaml (router) ->
      router.resolveMethod 'get', uriTemplate, handler

  post: (uriTemplate, handler) =>
    @readRaml (router) ->
      router.resolveMethod 'post', uriTemplate, handler

  put: (uriTemplate, handler) =>
    @readRaml (router) ->
      router.resolveMethod 'put', uriTemplate, handler

  delete: (uriTemplate, handler) =>
    @readRaml (router) ->
      router.resolveMethod 'delete', uriTemplate, handler

  head: (uriTemplate, handler) =>
    @readRaml (router) ->
      router.resolveMethod 'head', uriTemplate, handler

  patch: (uriTemplate, handler) =>
    @readRaml (router) ->
      router.resolveMethod 'patch', uriTemplate, handler

  readRaml: (callback) =>
    parser.loadRaml @settings.ramlFile, (wrapper) =>
      resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      uriTemplateReader = new UriTemplateReader templates
      router = new ApiKitRouter @apiPath, @context, resources, uriTemplateReader

      callback router, uriTemplateReader, resources

module.exports = ApiKit
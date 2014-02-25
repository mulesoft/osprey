express = require 'express'
path = require 'path'
Validation = require './validation'
DefaultParameters = require './default-parameters'
errorDefaultSettings = require './error-default-settings'
fs = require 'fs'
url = require 'url'

class Osprey
  handlers: []

  constructor: (@apiPath, @context, @settings, @logger) ->
    unless @settings?
      @settings = {}

    @context.disable 'x-powered-by'

  register: (router, uriTemplateReader, resources) =>
    @settings.enableValidations = true unless @settings.enableValidations?
    
    @context.use @loadDefaultParameters(@apiPath, uriTemplateReader, resources, @logger)

    if @settings.enableValidations
      @context.use @validations(uriTemplateReader, resources)

    @context.use @route(router, @settings.enableMocks)

    @context.use @exceptionHandler(@settings.exceptionHandler)

  registerConsole: () =>
    @settings.enableConsole = true unless @settings.enableConsole?
    @settings.consolePath = "/console" unless @settings.consolePath

    if @settings.enableConsole
      @settings.consolePath = @apiPath + @settings.consolePath
      @context.get @settings.consolePath, @consoleHandler(@apiPath, @settings.consolePath, @context.settings.port)
      @context.get url.resolve(@settings.consolePath, 'index.html'), @consoleHandler(@apiPath, @settings.consolePath, @context.settings.port)
      @context.use @settings.consolePath, express.static(path.join(__dirname, 'assets/console'))

      @context.get @apiPath, @ramlHandler(@settings.ramlFile, @apiPath, @context.settings.port)
      @context.use @apiPath, express.static(path.dirname(@settings.ramlFile))
      @logger.info "Osprey::APIConsole has been initialized successfully listening at #{@settings.consolePath}"

  consoleHandler: (apiPath, consolePath, port) ->
    return (req, res) ->
      filePath = path.join __dirname, '/assets/console/index.html'

      fs.readFile filePath, (err, data) ->
        data = data.toString().replace(/apiPath/gi, url.resolve("http://localhost:#{port}/", apiPath))
        data = data.toString().replace(/resourcesPath/gi, url.resolve("http://localhost:#{port}/", consolePath))
        res.set 'Content-Type', 'text/html'
        res.send data

  ramlHandler: (ramlPath, apiPath, port) ->
    return (req, res) ->
      if req.accepts('application/raml+yaml')?
        
        fs.readFile ramlPath, (err, data) ->
          data = data.toString().replace(/^baseUri:.*$/gmi, "baseUri: #{url.resolve("http://localhost:#{port}/", apiPath)}")
          res.send data
      else
        res.send 406

  route: (router, enableMocks) =>
    @logger.info 'Osprey::Router has been initialized successfully'

    for handler in @handlers
      router.resolveMethod handler

    (req, res, next) =>
      if req.path.indexOf(@apiPath) >= 0
        router.resolveMock req, res, next, @settings.enableMocks
      else
        next()

  exceptionHandler: (settings) ->
    @logger.info 'Osprey::ExceptionHandler has been initialized successfully'

    for key,value of settings
      errorDefaultSettings[key] = value

    (err, req, res, next) ->
      errorHandler = errorDefaultSettings[err.constructor.name]

      if errorHandler?
        errorHandler err, req, res, next
      else
        next()

  validations: (uriTemplateReader, resources) =>
    @logger.info 'Osprey::Validations has been initialized successfully'

    (req, res, next) =>
      regex = new RegExp "^\\" + @apiPath + "(.*)"
      urlPath = regex.exec req.url

      if urlPath and urlPath.length > 1
        uri = urlPath[1].split('?')[0]
        template = uriTemplateReader.getTemplateFor(uri)

        if template?
          resource = resources[template.uriTemplate]

          if resource?
            validation = new Validation req, uriTemplateReader, resource, @apiPath

            validation.validate()

      next()

  loadDefaultParameters: (apiPath, uriTemplateReader, resources, logger) ->
    middleware = new DefaultParameters apiPath, uriTemplateReader, resources, logger
    middleware.checkDefaults

  get: (uriTemplate, handler) =>
    @handlers.push { method: 'get', template: uriTemplate, handler: handler }

  post: (uriTemplate, handler) =>
    @handlers.push { method: 'post', template: uriTemplate, handler: handler }

  put: (uriTemplate, handler) =>
    @handlers.push { method: 'put', template: uriTemplate, handler: handler }

  delete: (uriTemplate, handler) =>
    @handlers.push { method: 'delete', template: uriTemplate, handler: handler }

  head: (uriTemplate, handler) =>
    @handlers.push { method: 'head', template: uriTemplate, handler: handler }

  patch: (uriTemplate, handler) =>
    @handlers.push { method: 'patch', template: uriTemplate, handler: handler }

module.exports = Osprey

express = require 'express'
path = require 'path'
Validation = require './middlewares/validation'
DefaultParameters = require './middlewares/default-parameters'
ErrorHandler = require './middlewares/error-handler'
OspreyRouter = require './middlewares/router'
OspreyBase = require './osprey-base'
fs = require 'fs'
url = require 'url'
Promise = require 'bluebird'

class Osprey extends OspreyBase
  register: (uriTemplateReader, resources) =>
    middlewares = []

    middlewares.push DefaultParameters

    if @settings.enableValidations
      middlewares.push Validation

    middlewares.push OspreyRouter
    middlewares.push ErrorHandler

    @registerMiddlewares middlewares, @apiPath, @context, @settings, resources, uriTemplateReader, @logger

  registerConsole: () =>
    if @settings.enableConsole
      @settings.consolePath = @apiPath + @settings.consolePath
      pathToRaml = "#{@apiPath}/#{path.basename @settings.ramlFile}"

      @context.get @settings.consolePath, @consoleHandler(pathToRaml, @settings.consolePath)
      @context.get url.resolve(@settings.consolePath + '/', 'index.html'), @consoleHandler(pathToRaml, @settings.consolePath)
      @context.use @settings.consolePath, express.static(path.join(__dirname, 'assets/console'))

      @context.get @apiPath, @ramlHandler(@apiPath, @settings.ramlFile)
      @context.use @apiPath, express.static(path.dirname(@settings.ramlFile))

      @logger.info "Osprey::APIConsole has been initialized successfully listening at #{@settings.consolePath}"

  consoleHandler: (apiPath, consolePath) ->
    (req, res) ->
      filePath = path.join __dirname, '/assets/console/index.html'

      fs.readFile filePath, (err, data) ->
        data = data.toString().replace(/apiPath/gi, apiPath)
        data = data.toString().replace(/resourcesPath/gi, consolePath)
        res.set 'Content-Type', 'text/html'
        res.send data

  ramlHandler: (apiPath, ramlPath) ->
    (req, res) ->
      if req.accepts('application/raml+yaml')?
        baseUri = "http#{if req.secure then 's' else ''}://#{req.headers.host}#{req.originalUrl}"

        fs.readFile ramlPath, (err, data) ->
          data = data.toString().replace(/^baseUri:.*$/gmi, "baseUri: #{baseUri}")
          res.set 'Content-Type', 'application/raml+yaml'
          res.send data
      else
        res.send 406

  load: (err, uriTemplateReader, resources) ->
    unless err?
      if @apiDescriptor? and typeof @apiDescriptor == 'function'
        @apiDescriptor this, @context

      @register(uriTemplateReader, resources)

  describe: (descriptor) ->
    @apiDescriptor = descriptor
    Promise.resolve @context

module.exports = Osprey

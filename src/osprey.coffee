express = require 'express'
path = require 'path'
Validation = require './middlewares/validation'
DefaultParameters = require './middlewares/default-parameters'
ErrorHandler = require './middlewares/error-handler'
OspreyRouter = require './middlewares/router'
OspreyBase = require './osprey-base'
fs = require 'fs'
url = require 'url'

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
      host = "http://localhost:#{@context.settings.port}/"
      @settings.consolePath = @apiPath + @settings.consolePath

      @context.get @settings.consolePath, @consoleHandler(@apiPath, @settings.consolePath, host)
      @context.get url.resolve(@settings.consolePath, 'index.html'), @consoleHandler(@apiPath, @settings.consolePath, @context.settings.port)
      @context.use @settings.consolePath, express.static(path.join(__dirname, 'assets/console'))

      @context.get @apiPath, @ramlHandler(@apiPath, @settings.ramlFile, host)
      @context.use @apiPath, express.static(path.dirname(@settings.ramlFile))

      @logger.info "Osprey::APIConsole has been initialized successfully listening at #{@settings.consolePath}"

  consoleHandler: (apiPath, consolePath, host) ->
    (req, res) ->
      filePath = path.join __dirname, '/assets/console/index.html'

      fs.readFile filePath, (err, data) ->
        data = data.toString().replace(/apiPath/gi, url.resolve(host, apiPath))
        data = data.toString().replace(/resourcesPath/gi, url.resolve(host, consolePath))
        res.set 'Content-Type', 'text/html'
        res.send data

  ramlHandler: (apiPath, ramlPath, host) ->
    (req, res) ->
      if req.accepts('application/raml+yaml')?
        fs.readFile ramlPath, (err, data) ->
          data = data.toString().replace(/^baseUri:.*$/gmi, "baseUri: #{url.resolve(host, apiPath)}")
          res.send data
      else
        res.send 406

  describe: (descriptor) ->
    descriptor(this)
    this

module.exports = Osprey

UriTemplateReader = require './uri-template-reader'
parser = require './wrapper'
Osprey = require './osprey'
UriTemplateReader = require './uri-template-reader'
logger = require './utils/logger'
path = require 'path'
express = require 'express'

exports.create = (apiPath, context, settings) ->
  unless settings.ramlFile
    settings.ramlFile = path.join process.cwd(), '/src/assets/raml/api.raml'

  ospreyApp = express()
  context.use apiPath, ospreyApp

  osprey = new Osprey apiPath, ospreyApp, settings, logger, context

  logger.setLevel settings.logLevel

  parser.loadRaml settings.ramlFile, logger, (wrapper) ->
    resources = wrapper.getResources()
    uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

    osprey.load null, uriTemplateReader, resources

    # Register the console after Osprey has been loaded, since Osprey is
    # attached asynchronously after RAML is parsed. The first call to any
    # Express http method will mount the router and we don't want that to
    # occur until we actually can handle it with Osprey.
    osprey.registerConsole()

  osprey

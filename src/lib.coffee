UriTemplateReader = require './uri-template-reader'
parser = require './wrapper'
Osprey = require './osprey'
UriTemplateReader = require './uri-template-reader'
logger = require './utils/logger'

exports.create = (apiPath, context, settings) ->
  osprey = new Osprey apiPath, context, settings, logger

  logger.setLevel settings.logLevel

  osprey.registerConsole()

  parser.loadRaml settings.ramlFile, logger, (wrapper) ->
    resources = wrapper.getResources()
    uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

    osprey.load null, uriTemplateReader, resources

  osprey
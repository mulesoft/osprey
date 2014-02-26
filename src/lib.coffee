UriTemplateReader = require './uri-template-reader'
parser = require './wrapper'
Osprey = require './osprey'
UriTemplateReader = require './uri-template-reader'
OspreyRouter = require './router'
logger = require './utils/logger'

exports.create = (apiPath, context, settings) ->
  osprey = new Osprey apiPath, context, settings, logger

  logger.setLevel settings.logLevel

  osprey.registerConsole()

  parser.loadRaml settings.ramlFile, logger, (wrapper) ->
    resources = wrapper.getResources()
    templates = wrapper.getUriTemplates()
    uriTemplateReader = new UriTemplateReader templates
    router = new OspreyRouter apiPath, context, resources, uriTemplateReader, logger

    osprey.register router, uriTemplateReader, resources

  osprey
UriTemplateReader = require './uri-template-reader'
parser = require './wrapper'
Osprey = require './osprey'
UriTemplateReader = require './uri-template-reader'
logger = require './utils/logger'

exports.create = (apiPath, context, settings, callback) ->
  osprey = new Osprey apiPath, context, settings, logger

  logger.setLevel settings.logLevel

  osprey.registerConsole()

  parser.loadRaml settings.ramlFile, logger, (wrapper) ->
    resources = wrapper.getResources()
    uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

    if callback? and typeof callback == 'function'
      callback {}, osprey, context

    osprey.register uriTemplateReader, resources

  , (error) ->
    if callback? and typeof callback == 'function'
      callback error, osprey, context

  osprey
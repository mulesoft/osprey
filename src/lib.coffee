UriTemplateReader = require './uri-template-reader'
parser = require './wrapper'
Osprey = require './osprey'
UriTemplateReader = require './uri-template-reader'
OspreyRouter = require './router'
logger = require './utils/logger'

exports.create = (apiPath, context, settings) ->
  osprey = new Osprey apiPath, context, settings

  logger.setLevel settings.logLevel

  osprey.registerConsole()

  parser.loadRaml settings.ramlFile, (wrapper) ->
    resources = wrapper.getResources()
    templates = wrapper.getUriTemplates()
    uriTemplateReader = new UriTemplateReader templates
    router = new OspreyRouter apiPath, context, resources, uriTemplateReader

    osprey.register router, uriTemplateReader, resources
    osprey.init router

  osprey

exports.route = (apiPath, context, settings) ->
  osprey = new Osprey(apiPath, context, settings)

  logger.setLevel settings.logLevel

  parser.loadRaml settings.ramlFile, (wrapper) ->
    resources = wrapper.getResources()
    templates = wrapper.getUriTemplates()
    uriTemplateReader = new UriTemplateReader templates
    router = new OspreyRouter apiPath, context, resources, uriTemplateReader

    context.use osprey.route router, settings.enableMocks
    osprey.init router

  osprey

exports.validations = (apiPath, context, settings) ->
  logger.setLevel settings.logLevel

  parser.loadRaml settings.ramlFile, (wrapper) ->
    resources = wrapper.getResources()
    templates = wrapper.getUriTemplates()
    uriTemplateReader = new UriTemplateReader templates

    osprey = new Osprey(apiPath, context, settings)
    context.use osprey.validations uriTemplateReader, resources

exports.exceptionHandler = (apiPath, context, settings) ->
  osprey = new Osprey(apiPath, context, settings)
  context.use osprey.exceptionHandler(settings)

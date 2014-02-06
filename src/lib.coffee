UriTemplateReader = require './uri-template-reader'
parser = require './wrapper'
Osprey = require './osprey'

exports.create = (apiPath, context, settings) =>
  @osprey = new Osprey(apiPath, context, settings)
  @osprey.register()
  @osprey

exports.route = (apiPath, context, settings) ->
  @osprey = new Osprey(apiPath, context, settings)
  @osprey.route settings.enableMocks

exports.validations = (apiPath, context, settings) ->
  @osprey = new Osprey(apiPath, context, settings)
  @osprey.validations()

exports.exceptionHandler = (apiPath, context, settings) ->
  @osprey = new Osprey(apiPath, context, settings)
  @osprey.exceptionHandler settings
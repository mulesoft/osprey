UriTemplateReader = require './uri-template-reader'
parser = require './wrapper'
ApiKit = require './apikit'

exports.create = (apiPath, context, settings) =>
  @apikit = new ApiKit(apiPath, context, settings)
  @apikit.register()
  @apikit

exports.route = (apiPath, context, settings) ->
  @apikit = new ApiKit(apiPath, context, settings)
  @apikit.route settings.enableMocks

exports.validations = (apiPath, context, settings) ->
  @apikit = new ApiKit(apiPath, context, settings)
  @apikit.validations()
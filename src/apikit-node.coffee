UriTemplateReader = require './uri-template-reader'
Validation = require './validation/validation'
parser = require './wrapper'
ApiKit = require './apikit'

exports.register = (apiPath, context, settings) =>
  @apikit = new ApiKit(apiPath, context, settings)
  @apikit.register()

exports.route = (apiPath, context, settings) ->
  @apikit = new ApiKit(apiPath, context, settings)
  @apikit.route settings.enableMocks

exports.get = (uriTemplate, handler) =>
  @apikit.get uriTemplate, handler

validations = (ramlPath, routes) ->
  (req, res, next) ->
    parser.loadRaml ramlPath, (wrapper) ->
      resources = wrapper.getResources()

      result = routes[req.method.toLowerCase()].filter (route) ->
        req.url.match(route.regexp)?.length

      if result.length
        resource = resources[result[0].path]

        templates = wrapper.getUriTemplates()

        uriTemplateReader = new UriTemplateReader templates

        validation = new Validation req, uriTemplateReader, resource
        if not validation.isValid()
          res.status('400')
          return

      next()

exports.validations = validations
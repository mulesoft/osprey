UriTemplateReader = require './uri-template-reader'
ApiKitRouter = require './router'
parser = require './wrapper'
express = require 'express'
Validation = require './validation/validation'

ramlEndpoint = (ramlPath) ->
  return (req, res) ->
    if req.accepts('application/raml+yaml')?
      res.sendfile ramlPath
    else
      res.send 406

ramlRouting = (apiPath, ramlPath, routes) ->
  (req, res, next) ->
    if req.path.indexOf(apiPath) >= 0
      parser.loadRaml ramlPath, (wrapper) ->
        resources = wrapper.getResources()
        templates = wrapper.getUriTemplates()
        uriTemplateReader = new UriTemplateReader templates

        router = new ApiKitRouter routes, resources, uriTemplateReader
        router.resolve apiPath, req, res, next
    else
      next()

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

exports.register = (apiPath, context, path) ->
  context.use ramlRouting(apiPath, path + '/assets/raml/api.raml', context.routes)
  context.use "#{apiPath}/console", express.static(path + '/assets/console')
  context.get apiPath, ramlEndpoint(path + '/assets/raml/api.raml')

exports.ramlEndpoint = ramlEndpoint
exports.ramlRouting = ramlRouting
exports.validations = validations

# TODO: Default Parameters should be exposed from here
# TODO: Exception Handling should be exposed from here

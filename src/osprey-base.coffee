class OspreyBase
  constructor: (@apiPath, @context, @settings, @logger) ->
    unless @settings?
      @settings = {}

    @settings.handlers = []
    @context.disable 'x-powered-by'
    @checkSettings @settings

  checkSettings: (settings) ->
    @settings.enableValidations = true unless @settings.enableValidations?
    @settings.enableConsole = true unless @settings.enableConsole?
    @settings.consolePath = "/console" unless @settings.consolePath

  registerMiddlewares: (middlewares, apiPath, context, settings, resources, uriTemplateReader, logger) ->
    for middleware in middlewares
      temp = new middleware apiPath, context, settings, resources, uriTemplateReader, logger
      @context.use temp.exec

  get: (uriTemplate, handlers...) =>
    @settings.handlers.push { method: 'get', template: uriTemplate, handler: handlers }

  post: (uriTemplate, handlers...) =>
    @settings.handlers.push { method: 'post', template: uriTemplate, handler: handlers }

  put: (uriTemplate, handlers...) =>
    @settings.handlers.push { method: 'put', template: uriTemplate, handler: handlers }

  delete: (uriTemplate, handlers...) =>
    @settings.handlers.push { method: 'delete', template: uriTemplate, handler: handlers }

  head: (uriTemplate, handlers...) =>
    @settings.handlers.push { method: 'head', template: uriTemplate, handler: handlers }

  patch: (uriTemplate, handlers...) =>
    @settings.handlers.push { method: 'patch', template: uriTemplate, handler: handlers }

module.exports = OspreyBase

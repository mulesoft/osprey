class OspreyBase
  constructor: (@apiPath, @context, @settings, @logger) ->
    unless @settings?
      @settings = {}

    @context.locals.handlers = []
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
      
  get: (uriTemplate, handler) =>
    @context.locals.handlers.push { method: 'get', template: uriTemplate, handler: handler }

  post: (uriTemplate, handler) =>
    @context.locals.handlers.push { method: 'post', template: uriTemplate, handler: handler }

  put: (uriTemplate, handler) =>
    @context.locals.handlers.push { method: 'put', template: uriTemplate, handler: handler }

  delete: (uriTemplate, handler) =>
    @context.locals.handlers.push { method: 'delete', template: uriTemplate, handler: handler }

  head: (uriTemplate, handler) =>
    @context.locals.handlers.push { method: 'head', template: uriTemplate, handler: handler }

  patch: (uriTemplate, handler) =>
    @context.locals.handlers.push { method: 'patch', template: uriTemplate, handler: handler }

module.exports = OspreyBase
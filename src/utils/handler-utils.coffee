
exports.resolveWithMiddlewares = (method, context, uriTemplate, handlers, handleLastMiddleware) =>
  [middlewares..., handler] = handlers;
  middlewares.unshift uriTemplate;

  if handleLastMiddleware
    middlewares.push handleLastMiddleware(handler)
  else 
    middlewares.push handler
    
  context[method].apply context, middlewares
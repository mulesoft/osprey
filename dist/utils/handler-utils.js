(function() {
  var __slice = [].slice;

  exports.resolveWithMiddlewares = function(method, context, uriTemplate, handlers, handleLastMiddleware) {
    var handler, middlewares, _i;
    middlewares = 2 <= handlers.length ? __slice.call(handlers, 0, _i = handlers.length - 1) : (_i = 0, []), handler = handlers[_i++];
    middlewares.unshift(uriTemplate);
    if (handleLastMiddleware) {
      middlewares.push(handleLastMiddleware(handler));
    } else {
      middlewares.push(handler);
    }
    return context[method].apply(context, middlewares);
  };

}).call(this);

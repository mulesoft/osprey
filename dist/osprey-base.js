(function() {
  var OspreyBase,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  OspreyBase = (function() {
    function OspreyBase(apiPath, context, settings, logger) {
      this.apiPath = apiPath;
      this.context = context;
      this.settings = settings;
      this.logger = logger;
      this.patch = __bind(this.patch, this);
      this.head = __bind(this.head, this);
      this["delete"] = __bind(this["delete"], this);
      this.put = __bind(this.put, this);
      this.post = __bind(this.post, this);
      this.get = __bind(this.get, this);
      if (this.settings == null) {
        this.settings = {};
      }
      this.settings.handlers = [];
      this.context.disable('x-powered-by');
      this.checkSettings(this.settings);
    }

    OspreyBase.prototype.checkSettings = function(settings) {
      if (this.settings.enableValidations == null) {
        this.settings.enableValidations = true;
      }
      if (this.settings.enableConsole == null) {
        this.settings.enableConsole = true;
      }
      if (!this.settings.consolePath) {
        return this.settings.consolePath = "/console";
      }
    };

    OspreyBase.prototype.registerMiddlewares = function(middlewares, apiPath, context, settings, resources, uriTemplateReader, logger) {
      var middleware, temp, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = middlewares.length; _i < _len; _i++) {
        middleware = middlewares[_i];
        temp = new middleware(apiPath, context, settings, resources, uriTemplateReader, logger);
        _results.push(this.context.use(temp.exec));
      }
      return _results;
    };

    OspreyBase.prototype.get = function(uriTemplate, handler) {
      return this.settings.handlers.push({
        method: 'get',
        template: uriTemplate,
        handler: handler
      });
    };

    OspreyBase.prototype.post = function(uriTemplate, handler) {
      return this.settings.handlers.push({
        method: 'post',
        template: uriTemplate,
        handler: handler
      });
    };

    OspreyBase.prototype.put = function(uriTemplate, handler) {
      return this.settings.handlers.push({
        method: 'put',
        template: uriTemplate,
        handler: handler
      });
    };

    OspreyBase.prototype["delete"] = function(uriTemplate, handler) {
      return this.settings.handlers.push({
        method: 'delete',
        template: uriTemplate,
        handler: handler
      });
    };

    OspreyBase.prototype.head = function(uriTemplate, handler) {
      return this.settings.handlers.push({
        method: 'head',
        template: uriTemplate,
        handler: handler
      });
    };

    OspreyBase.prototype.patch = function(uriTemplate, handler) {
      return this.settings.handlers.push({
        method: 'patch',
        template: uriTemplate,
        handler: handler
      });
    };

    return OspreyBase;

  })();

  module.exports = OspreyBase;

}).call(this);

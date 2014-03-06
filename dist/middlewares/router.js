(function() {
  var DeleteMethod, GetMethod, HeadMethod, OspreyRouter, PatchMethod, PostMethod, PutMethod, RamlHelper,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GetMethod = require('../handlers/get-handler');

  PostMethod = require('../handlers/post-handler');

  PutMethod = require('../handlers/put-handler');

  DeleteMethod = require('../handlers/delete-handler');

  HeadMethod = require('../handlers/head-handler');

  PatchMethod = require('../handlers/patch-handler');

  RamlHelper = require('../utils/raml-helper');

  OspreyRouter = (function(_super) {
    __extends(OspreyRouter, _super);

    function OspreyRouter(apiPath, context, settings, resources, uriTemplateReader, logger) {
      var handler, _i, _len, _ref;
      this.apiPath = apiPath;
      this.context = context;
      this.settings = settings;
      this.resources = resources;
      this.uriTemplateReader = uriTemplateReader;
      this.logger = logger;
      this.resolveMethod = __bind(this.resolveMethod, this);
      this.routerExists = __bind(this.routerExists, this);
      this.resolveMock = __bind(this.resolveMock, this);
      this.exec = __bind(this.exec, this);
      this.logger.info('Osprey::Router has been initialized successfully');
      this.mockMethodHandlers = {
        get: new GetMethod.MockHandler,
        post: new PostMethod.MockHandler,
        put: new PutMethod.MockHandler,
        "delete": new DeleteMethod.MockHandler,
        head: new HeadMethod.MockHandler,
        patch: new PatchMethod.MockHandler
      };
      this.methodHandlers = {
        get: new GetMethod.Handler(this.apiPath, this.context, this.resources),
        post: new PostMethod.Handler(this.apiPath, this.context, this.resources),
        put: new PutMethod.Handler(this.apiPath, this.context, this.resources),
        "delete": new DeleteMethod.Handler(this.apiPath, this.context, this.resources),
        head: new HeadMethod.Handler(this.apiPath, this.context, this.resources),
        patch: new PatchMethod.Handler(this.apiPath, this.context, this.resources)
      };
      if (this.settings.handlers != null) {
        _ref = this.settings.handlers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          this.resolveMethod(handler);
        }
      }
    }

    OspreyRouter.prototype.exec = function(req, res, next) {
      if (req.path.indexOf(this.apiPath) >= 0) {
        return this.resolveMock(req, res, next, this.settings.enableMocks);
      } else {
        return next();
      }
    };

    OspreyRouter.prototype.resolveMock = function(req, res, next, enableMocks) {
      var method, methodInfo, regex, reqUrl, template, uri, urlPath;
      regex = new RegExp("^\\" + this.apiPath + "(.*)");
      urlPath = regex.exec(req.url);
      if (urlPath && urlPath.length > 1) {
        uri = urlPath[1].split('?')[0];
        reqUrl = req.url.split('?')[0];
        template = this.uriTemplateReader.getTemplateFor(uri);
        method = req.method.toLowerCase();
        if (enableMocks == null) {
          enableMocks = true;
        }
        if ((template != null) && !this.routerExists(method, reqUrl)) {
          methodInfo = this.methodLookup(this.resources, method, template.uriTemplate);
          if ((methodInfo != null) && enableMocks) {
            this.mockMethodHandlers[method].resolve(req, res, methodInfo);
            return;
          }
        }
      }
      return next();
    };

    OspreyRouter.prototype.routerExists = function(httpMethod, uri) {
      var result;
      if (this.context.routes[httpMethod] != null) {
        result = this.context.routes[httpMethod].filter(function(route) {
          var _ref;
          return (_ref = uri.match(route.regexp)) != null ? _ref.length : void 0;
        });
      }
      return (result != null) && result.length === 1;
    };

    OspreyRouter.prototype.resolveMethod = function(config) {
      var resourceExists, _ref, _ref1;
      resourceExists = (_ref = this.resources[config.template]) != null ? (_ref1 = _ref.methods) != null ? _ref1.filter(function(info) {
        return info.method === config.method;
      }) : void 0 : void 0;
      if ((resourceExists != null) && resourceExists.length > 0) {
        if (config.handler) {
          this.logger.debug("Overwritten resource - " + (config.method.toUpperCase()) + " " + config.template);
          return this.methodHandlers[config.method].resolve(config.template, config.handler);
        } else {
          return this.logger.error("Resource to overwrite does not have handlers defined - " + (config.method.toUpperCase()) + " " + config.template);
        }
      } else {
        return this.logger.error("Resource to overwrite does not exists - " + (config.method.toUpperCase()) + " " + config.template);
      }
    };

    return OspreyRouter;

  })(RamlHelper);

  module.exports = OspreyRouter;

}).call(this);

(function() {
  var Osprey, OspreyRouter, UriTemplateReader, Validation, express, parser, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  UriTemplateReader = require('./uri-template-reader');

  OspreyRouter = require('./router');

  parser = require('./wrapper');

  express = require('express');

  path = require('path');

  Validation = require('./validation');

  Osprey = (function() {
    function Osprey(apiPath, context, settings) {
      this.apiPath = apiPath;
      this.context = context;
      this.settings = settings;
      this.readRaml = __bind(this.readRaml, this);
      this.patch = __bind(this.patch, this);
      this.head = __bind(this.head, this);
      this["delete"] = __bind(this["delete"], this);
      this.put = __bind(this.put, this);
      this.post = __bind(this.post, this);
      this.get = __bind(this.get, this);
      this.validations = __bind(this.validations, this);
      this.route = __bind(this.route, this);
      this.register = __bind(this.register, this);
    }

    Osprey.prototype.register = function() {
      if (this.settings.enableConsole == null) {
        this.settings.enableConsole = true;
      }
      if (this.settings.enableValidations == null) {
        this.settings.enableValidations = true;
      }
      if (this.settings.enableValidations) {
        this.context.use(this.validations());
      }
      this.context.use(this.route(this.settings.enableMocks));
      if (this.settings.enableConsole) {
        this.context.use("" + this.apiPath + "/console", express["static"](path.join(__dirname, '/assets/console')));
        this.context.get(this.apiPath, this.ramlHandler(this.settings.ramlFile));
      }
      if (this.settings.exceptionHandler) {
        return this.context.use(this.exceptionHandler(this.settings.exceptionHandler));
      }
    };

    Osprey.prototype.ramlHandler = function(ramlPath) {
      return function(req, res) {
        if (req.accepts('application/raml+yaml') != null) {
          return res.sendfile(ramlPath);
        } else {
          return res.send(406);
        }
      };
    };

    Osprey.prototype.route = function(enableMocks) {
      var _this = this;
      return function(req, res, next) {
        if (req.path.indexOf(_this.apiPath) >= 0) {
          return _this.readRaml(function(router) {
            return router.resolveMock(req, res, next, _this.settings.enableMocks);
          });
        } else {
          return next();
        }
      };
    };

    Osprey.prototype.exceptionHandler = function(settings) {
      return function(err, req, res, next) {
        var errorHandler;
        errorHandler = settings[err.constructor.name];
        if (errorHandler != null) {
          return errorHandler(err, req, res);
        } else {
          return next();
        }
      };
    };

    Osprey.prototype.validations = function() {
      var _this = this;
      return function(req, res, next) {
        return _this.readRaml(function(router, uriTemplateReader, resources) {
          var regex, resource, template, uri, urlPath, validation;
          regex = new RegExp("^\\" + _this.apiPath + "(.*)");
          urlPath = regex.exec(req.url);
          if (urlPath && urlPath.length > 1) {
            uri = urlPath[1].split('?')[0];
            template = uriTemplateReader.getTemplateFor(uri);
            if (template != null) {
              resource = resources[template.uriTemplate];
              if (resource != null) {
                validation = new Validation(req, uriTemplateReader, resource, _this.apiPath);
                if (req.path.indexOf(_this.apiPath) >= 0 && !validation.isValid()) {
                  res.send(400);
                  return;
                }
              }
            }
          }
          return next();
        });
      };
    };

    Osprey.prototype.get = function(uriTemplate, handler) {
      return this.readRaml(function(router) {
        return router.resolveMethod('get', uriTemplate, handler);
      });
    };

    Osprey.prototype.post = function(uriTemplate, handler) {
      return this.readRaml(function(router) {
        return router.resolveMethod('post', uriTemplate, handler);
      });
    };

    Osprey.prototype.put = function(uriTemplate, handler) {
      return this.readRaml(function(router) {
        return router.resolveMethod('put', uriTemplate, handler);
      });
    };

    Osprey.prototype["delete"] = function(uriTemplate, handler) {
      return this.readRaml(function(router) {
        return router.resolveMethod('delete', uriTemplate, handler);
      });
    };

    Osprey.prototype.head = function(uriTemplate, handler) {
      return this.readRaml(function(router) {
        return router.resolveMethod('head', uriTemplate, handler);
      });
    };

    Osprey.prototype.patch = function(uriTemplate, handler) {
      return this.readRaml(function(router) {
        return router.resolveMethod('patch', uriTemplate, handler);
      });
    };

    Osprey.prototype.readRaml = function(callback) {
      var _this = this;
      return parser.loadRaml(this.settings.ramlFile, function(wrapper) {
        var resources, router, templates, uriTemplateReader;
        resources = wrapper.getResources();
        templates = wrapper.getUriTemplates();
        uriTemplateReader = new UriTemplateReader(templates);
        router = new OspreyRouter(_this.apiPath, _this.context, resources, uriTemplateReader);
        return callback(router, uriTemplateReader, resources);
      });
    };

    return Osprey;

  })();

  module.exports = Osprey;

}).call(this);

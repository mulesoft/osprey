(function() {
  var DefaultParameters, Osprey, Validation, errorDefaultSettings, express, fs, path, url,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  express = require('express');

  path = require('path');

  Validation = require('./validation');

  DefaultParameters = require('./default-parameters');

  errorDefaultSettings = require('./error-default-settings');

  fs = require('fs');

  url = require('url');

  Osprey = (function() {
    Osprey.prototype.handlers = [];

    function Osprey(apiPath, context, settings, logger) {
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
      this.validations = __bind(this.validations, this);
      this.route = __bind(this.route, this);
      this.registerConsole = __bind(this.registerConsole, this);
      this.register = __bind(this.register, this);
      if (this.settings == null) {
        this.settings = {};
      }
      this.context.disable('x-powered-by');
    }

    Osprey.prototype.register = function(router, uriTemplateReader, resources) {
      if (this.settings.enableValidations == null) {
        this.settings.enableValidations = true;
      }
      this.context.use(this.loadDefaultParameters(this.apiPath, uriTemplateReader, resources, this.logger));
      if (this.settings.enableValidations) {
        this.context.use(this.validations(uriTemplateReader, resources));
      }
      this.context.use(this.route(router, this.settings.enableMocks));
      return this.context.use(this.exceptionHandler(this.settings.exceptionHandler));
    };

    Osprey.prototype.registerConsole = function() {
      if (this.settings.enableConsole == null) {
        this.settings.enableConsole = true;
      }
      if (!this.settings.consolePath) {
        this.settings.consolePath = "/console";
      }
      if (this.settings.enableConsole) {
        this.settings.consolePath = this.apiPath + this.settings.consolePath;
        this.context.get(this.settings.consolePath, this.consoleHandler(this.apiPath, this.settings.consolePath, this.context.settings.port));
        this.context.get(url.resolve(this.settings.consolePath, 'index.html'), this.consoleHandler(this.apiPath, this.settings.consolePath, this.context.settings.port));
        this.context.use(this.settings.consolePath, express["static"](path.join(__dirname, 'assets/console')));
        this.context.get(this.apiPath, this.ramlHandler(this.settings.ramlFile, this.apiPath, this.context.settings.port));
        this.context.use(this.apiPath, express["static"](path.dirname(this.settings.ramlFile)));
        return this.logger.info("Osprey::APIConsole has been initialized successfully listening at " + this.settings.consolePath);
      }
    };

    Osprey.prototype.consoleHandler = function(apiPath, consolePath, port) {
      return function(req, res) {
        var filePath;
        filePath = path.join(__dirname, '/assets/console/index.html');
        return fs.readFile(filePath, function(err, data) {
          data = data.toString().replace(/apiPath/gi, url.resolve("http://localhost:" + port + "/", apiPath));
          data = data.toString().replace(/resourcesPath/gi, url.resolve("http://localhost:" + port + "/", consolePath));
          res.set('Content-Type', 'text/html');
          return res.send(data);
        });
      };
    };

    Osprey.prototype.ramlHandler = function(ramlPath, apiPath, port) {
      return function(req, res) {
        if (req.accepts('application/raml+yaml') != null) {
          return fs.readFile(ramlPath, function(err, data) {
            data = data.toString().replace(/^baseUri:.*$/gmi, "baseUri: " + (url.resolve("http://localhost:" + port + "/", apiPath)));
            return res.send(data);
          });
        } else {
          return res.send(406);
        }
      };
    };

    Osprey.prototype.route = function(router, enableMocks) {
      var handler, _i, _len, _ref,
        _this = this;
      this.logger.info('Osprey::Router has been initialized successfully');
      _ref = this.handlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        router.resolveMethod(handler);
      }
      return function(req, res, next) {
        if (req.path.indexOf(_this.apiPath) >= 0) {
          return router.resolveMock(req, res, next, _this.settings.enableMocks);
        } else {
          return next();
        }
      };
    };

    Osprey.prototype.exceptionHandler = function(settings) {
      var key, value;
      this.logger.info('Osprey::ExceptionHandler has been initialized successfully');
      for (key in settings) {
        value = settings[key];
        errorDefaultSettings[key] = value;
      }
      return function(err, req, res, next) {
        var errorHandler;
        errorHandler = errorDefaultSettings[err.constructor.name];
        if (errorHandler != null) {
          return errorHandler(err, req, res, next);
        } else {
          return next();
        }
      };
    };

    Osprey.prototype.validations = function(uriTemplateReader, resources) {
      var _this = this;
      this.logger.info('Osprey::Validations has been initialized successfully');
      return function(req, res, next) {
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
              validation.validate();
            }
          }
        }
        return next();
      };
    };

    Osprey.prototype.loadDefaultParameters = function(apiPath, uriTemplateReader, resources, logger) {
      var middleware;
      middleware = new DefaultParameters(apiPath, uriTemplateReader, resources, logger);
      return middleware.checkDefaults;
    };

    Osprey.prototype.get = function(uriTemplate, handler) {
      return this.handlers.push({
        method: 'get',
        template: uriTemplate,
        handler: handler
      });
    };

    Osprey.prototype.post = function(uriTemplate, handler) {
      return this.handlers.push({
        method: 'post',
        template: uriTemplate,
        handler: handler
      });
    };

    Osprey.prototype.put = function(uriTemplate, handler) {
      return this.handlers.push({
        method: 'put',
        template: uriTemplate,
        handler: handler
      });
    };

    Osprey.prototype["delete"] = function(uriTemplate, handler) {
      return this.handlers.push({
        method: 'delete',
        template: uriTemplate,
        handler: handler
      });
    };

    Osprey.prototype.head = function(uriTemplate, handler) {
      return this.handlers.push({
        method: 'head',
        template: uriTemplate,
        handler: handler
      });
    };

    Osprey.prototype.patch = function(uriTemplate, handler) {
      return this.handlers.push({
        method: 'patch',
        template: uriTemplate,
        handler: handler
      });
    };

    return Osprey;

  })();

  module.exports = Osprey;

}).call(this);

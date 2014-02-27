(function() {
  var DefaultParameters,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DefaultParameters = (function() {
    function DefaultParameters(apiPath, context, settings, resources, uriTemplateReader, logger) {
      this.apiPath = apiPath;
      this.context = context;
      this.settings = settings;
      this.resources = resources;
      this.uriTemplateReader = uriTemplateReader;
      this.logger = logger;
      this.checkFormParameters = __bind(this.checkFormParameters, this);
      this.checkHeaders = __bind(this.checkHeaders, this);
      this.exec = __bind(this.exec, this);
      this.logger.info('Osprey::DefaultParameters has been initialized successfully');
    }

    DefaultParameters.prototype.exec = function(req, res, next) {
      var httpMethod, regex, resource, template, uri, urlPath;
      regex = new RegExp("^\\" + this.apiPath + "(.*)");
      urlPath = regex.exec(req.url);
      if (urlPath && urlPath.length > 1) {
        uri = urlPath[1].split('?')[0];
        template = this.uriTemplateReader.getTemplateFor(uri);
        if (template != null) {
          resource = this.resources[template.uriTemplate];
          if (resource != null) {
            httpMethod = this.getMethodInfoFrom(req.method, resource);
            if (httpMethod != null) {
              this.loadDefaults(req, httpMethod);
            }
          }
        }
      }
      return next();
    };

    DefaultParameters.prototype.getMethodInfoFrom = function(httpMethod, resource) {
      var method, _i, _len, _ref;
      if (resource.methods != null) {
        _ref = resource.methods;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          method = _ref[_i];
          if (method.method === httpMethod.toLowerCase()) {
            return method;
          }
        }
      }
      return null;
    };

    DefaultParameters.prototype.loadDefaults = function(req, method) {
      this.checkQueryParamters(req, method);
      this.checkHeaders(req, method);
      return this.checkFormParameters(req, method);
    };

    DefaultParameters.prototype.checkQueryParamters = function(req, method) {
      var key, parameterSettings, queryParameter, _ref, _results;
      if (method.queryParameters != null) {
        _ref = method.queryParameters;
        _results = [];
        for (key in _ref) {
          parameterSettings = _ref[key];
          queryParameter = req.query[key];
          if (queryParameter == null) {
            req.query[key] = parameterSettings["default"];
            _results.push(this.logger.debug("Query Parameter " + key + " defaulted to " + parameterSettings["default"] + " - Request: " + req.url));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    DefaultParameters.prototype.checkHeaders = function(req, method) {
      var header, headerSettings, key, _ref, _results;
      if (method.headers != null) {
        _ref = method.headers;
        _results = [];
        for (key in _ref) {
          headerSettings = _ref[key];
          header = req.headers[key];
          if (header == null) {
            req.headers[key] = headerSettings["default"];
            _results.push(this.logger.debug("Header " + key + " defaulted to " + headerSettings["default"] + " - Request: " + req.url));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    DefaultParameters.prototype.checkFormParameters = function(req, method) {
      var formParameters, key, parameter, parameterSettings, _ref, _results;
      if ((_ref = req.headers['content-type']) === 'application/x-www-form-urlencoded' || _ref === 'multipart/form-data') {
        formParameters = method.body['multipart/form-data'];
        if (formParameters == null) {
          formParameters = method.body['application/x-www-form-urlencoded'];
        }
        formParameters = formParameters.formParameters;
        _results = [];
        for (key in formParameters) {
          parameterSettings = formParameters[key];
          parameter = req.body[key];
          if (parameter == null) {
            req.body[key] = parameterSettings["default"];
            _results.push(this.logger.debug("Form Parameter " + key + " defaulted to " + parameterSettings["default"] + " - Request: " + req.url));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    return DefaultParameters;

  })();

  module.exports = DefaultParameters;

}).call(this);

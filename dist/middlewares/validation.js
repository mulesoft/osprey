(function() {
  var InvalidBodyError, InvalidFormParameterError, InvalidHeaderError, InvalidQueryParameterError, InvalidUriParameterError, SchemaValidator, Validation, Validators, libxml,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SchemaValidator = require('jsonschema').Validator;

  InvalidUriParameterError = require('../errors/invalid-uri-parameter-error');

  InvalidFormParameterError = require('../errors/invalid-form-parameter-error');

  InvalidQueryParameterError = require('../errors/invalid-query-parameter-error');

  InvalidHeaderError = require('../errors/invalid-header-error');

  InvalidBodyError = require('../errors/invalid-body-error');

  libxml = require('libxmljs');

  Validators = require('./validators');

  Validation = (function() {
    function Validation(apiPath, context, settings, resources, uriTemplateReader, logger) {
      this.apiPath = apiPath;
      this.context = context;
      this.settings = settings;
      this.resources = resources;
      this.uriTemplateReader = uriTemplateReader;
      this.logger = logger;
      this.validateType = __bind(this.validateType, this);
      this.isValid = __bind(this.isValid, this);
      this.validateHeaders = __bind(this.validateHeaders, this);
      this.validateQueryParams = __bind(this.validateQueryParams, this);
      this.validateFormParams = __bind(this.validateFormParams, this);
      this.validateUriParams = __bind(this.validateUriParams, this);
      this.validateSchema = __bind(this.validateSchema, this);
      this.validateRequest = __bind(this.validateRequest, this);
      this.exec = __bind(this.exec, this);
      this.logger.info('Osprey::Validations has been initialized successfully');
    }

    Validation.prototype.exec = function(req, res, next) {
      var regex, resource, template, uri, urlPath;
      regex = new RegExp("^\\" + this.apiPath + "(.*)");
      urlPath = regex.exec(req.url);
      if (urlPath && urlPath.length > 1) {
        uri = urlPath[1].split('?')[0];
        template = this.uriTemplateReader.getTemplateFor(uri);
        if (template != null) {
          resource = this.resources[template.uriTemplate];
          if (resource != null) {
            this.validateRequest(resource, req);
          }
        }
      }
      return next();
    };

    Validation.prototype.validateRequest = function(resource, req) {
      var method;
      method = this.methodInfoFor(resource, req.method.toLowerCase());
      this.validateUriParams(resource, req);
      if (method != null) {
        this.validateQueryParams(method, req);
        this.validateHeaders(method, req);
        this.validateFormParams(method, req);
        if (!this.validateSchema(method, req)) {
          throw new InvalidBodyError({});
        }
      }
    };

    Validation.prototype.isForm = function(req) {
      var _ref;
      return (_ref = req.headers['content-type']) === 'application/x-www-form-urlencoded' || _ref === 'multipart/form-data';
    };

    Validation.prototype.isJson = function(req) {
      var _ref;
      if (((_ref = req.headers) != null ? _ref['content-type'] : void 0) != null) {
        return req.headers['content-type'] === 'application/json' || req.headers['content-type'].match('\\+json$');
      }
    };

    Validation.prototype.isXml = function(req) {
      var _ref, _ref1;
      if (((_ref = req.headers) != null ? _ref['content-type'] : void 0) != null) {
        return ((_ref1 = req.headers['content-type']) === 'application/xml' || _ref1 === 'text/xml') || req.headers['content-type'].match('\\+xml$');
      }
    };

    Validation.prototype.validateSchema = function(method, req) {
      var contentType, schemaValidator, xml, xsd;
      if (method.body != null) {
        contentType = method.body[req.headers['content-type']];
        if ((contentType != null ? contentType.schema : void 0) != null) {
          if (this.isJson(req)) {
            schemaValidator = new SchemaValidator();
            return !(schemaValidator.validate(req.body, JSON.parse(contentType.schema))).errors.length;
          } else if (this.isXml(req)) {
            if (req.rawBody != null) {
              xml = libxml.parseXmlString(req.rawBody);
              xsd = libxml.parseXmlString(contentType.schema);
              return xml.validate(xsd);
            }
          }
        }
      }
      return true;
    };

    Validation.prototype.methodInfoFor = function(resource, httpMethod) {
      var method, _i, _len, _ref;
      if (resource.methods != null) {
        _ref = resource.methods;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          method = _ref[_i];
          if (method.method === httpMethod) {
            return method;
          }
        }
      }
      return null;
    };

    Validation.prototype.readValidationInfo = function(key, value, validationDescriptor) {
      var validationInfo;
      delete validationDescriptor.description;
      delete validationDescriptor.displayName;
      delete validationDescriptor.example;
      validationInfo = {
        parameter: key,
        value: value,
        validationRule: validationDescriptor
      };
      return validationInfo;
    };

    Validation.prototype.validateUriParams = function(resource, req) {
      var key, ramlUriParameter, reqUriParameters, uri, _ref, _results;
      if (resource.uriParameters != null) {
        uri = req.url.replace(this.apiPath, '');
        reqUriParameters = this.uriTemplateReader.getUriParametersFor(uri);
        _ref = resource.uriParameters;
        _results = [];
        for (key in _ref) {
          ramlUriParameter = _ref[key];
          if (!this.isValid(reqUriParameters[key], ramlUriParameter)) {
            this.logger.error("Invalid URI Parameter :" + key + " - Request: " + req.url + ", Parameter value: " + reqUriParameters[key]);
            this.logger.data("Validation rule", ramlUriParameter);
            throw new InvalidUriParameterError(this.readValidationInfo(key, reqUriParameters[key], ramlUriParameter));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validation.prototype.validateFormParams = function(method, req) {
      var formParameters, key, ramlFormParameter, reqFormParam, _results;
      if (this.isForm(req)) {
        formParameters = method.body['multipart/form-data'];
        if (formParameters == null) {
          formParameters = method.body['application/x-www-form-urlencoded'];
        }
        formParameters = formParameters.formParameters;
        _results = [];
        for (key in formParameters) {
          ramlFormParameter = formParameters[key];
          reqFormParam = req.body[key];
          if (!this.isValid(reqFormParam, ramlFormParameter)) {
            this.logger.error("Invalid Form Parameter :" + key + " - Request: " + req.url + ", Parameter value: " + reqFormParam);
            this.logger.data("Validation Info", ramlFormParameter);
            throw new InvalidFormParameterError(this.readValidationInfo(key, reqFormParam, ramlFormParameter));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validation.prototype.validateQueryParams = function(method, req) {
      var key, ramlQueryParameter, reqQueryParam, _ref, _results;
      if (method.queryParameters != null) {
        _ref = method.queryParameters;
        _results = [];
        for (key in _ref) {
          ramlQueryParameter = _ref[key];
          reqQueryParam = req.query[key];
          if (!this.isValid(reqQueryParam, ramlQueryParameter)) {
            this.logger.error("Invalid Query Parameter :" + key + " - Request: " + req.url + ", Parameter value: " + reqQueryParam);
            this.logger.data("Validation Info", ramlQueryParameter);
            throw new InvalidQueryParameterError(this.readValidationInfo(key, reqQueryParam, ramlQueryParameter));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validation.prototype.validateHeaders = function(method, req) {
      var key, ramlHeader, reqHeader, _ref, _results;
      if (method.headers != null) {
        _ref = method.headers;
        _results = [];
        for (key in _ref) {
          ramlHeader = _ref[key];
          reqHeader = req.headers[key];
          if (!this.isValid(reqHeader, ramlHeader)) {
            this.logger.error("Invalid Header :" + key + " - Request: " + req.url + ", Header value: " + reqHeader);
            this.logger.data("Validation Info", ramlHeader);
            throw new InvalidHeaderError(this.readValidationInfo(key, reqHeader, ramlHeader));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validation.prototype.isValid = function(reqParam, ramlParam) {
      return (this.validateRequired(reqParam, ramlParam)) && (this.validateType(reqParam, ramlParam));
    };

    Validation.prototype.validateRequired = function(reqParam, ramlParam) {
      return !ramlParam.required || (reqParam != null);
    };

    Validation.prototype.validateType = function(reqParam, ramlParam) {
      switch (ramlParam.type) {
        case 'string':
          return this.validateString(reqParam, ramlParam);
        case 'number':
          return this.validateNumber(reqParam, ramlParam);
        case 'integer':
          return this.validateInt(reqParam, ramlParam);
        case 'boolean':
          return this.validateBoolean(reqParam, ramlParam);
        case 'date':
          return this.validateDate(reqParam, ramlParam);
        default:
          return true;
      }
    };

    Validation.prototype.validateString = function(reqParam, ramlParam) {
      return Validators.StringValidator.validate(reqParam, ramlParam);
    };

    Validation.prototype.validateNumber = function(reqParam, ramlParam) {
      return Validators.NumberValidator.validate(reqParam, ramlParam);
    };

    Validation.prototype.validateInt = function(reqParam, ramlParam) {
      return Validators.IntegerValidator.validate(reqParam, ramlParam);
    };

    Validation.prototype.validateBoolean = function(reqParam, ramlParam) {
      return Validators.BooleanValidator.validate(reqParam, ramlParam);
    };

    Validation.prototype.validateDate = function(reqParam, ramlParam) {
      return Validators.DateValidator.validate(reqParam, ramlParam);
    };

    return Validation;

  })();

  module.exports = Validation;

}).call(this);

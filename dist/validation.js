(function() {
  var InvalidBodyError, InvalidFormParameterError, InvalidHeaderError, InvalidQueryParameterError, InvalidUriParameterError, OspreyBase, SchemaValidator, Validation, logger, moment,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SchemaValidator = require('jsonschema').Validator;

  OspreyBase = require('./utils/base');

  logger = require('./utils/logger');

  InvalidUriParameterError = require('./errors/invalid-uri-parameter-error');

  InvalidFormParameterError = require('./errors/invalid-form-parameter-error');

  InvalidQueryParameterError = require('./errors/invalid-query-parameter-error');

  InvalidHeaderError = require('./errors/invalid-header-error');

  InvalidBodyError = require('./errors/invalid-body-error');

  moment = require('moment');

  Validation = (function() {
    function Validation(req, uriTemplateReader, resource, apiPath) {
      this.req = req;
      this.uriTemplateReader = uriTemplateReader;
      this.resource = resource;
      this.apiPath = apiPath;
      this.validateType = __bind(this.validateType, this);
      this.validateRequired = __bind(this.validateRequired, this);
      this.isValid = __bind(this.isValid, this);
      this.validateHeaders = __bind(this.validateHeaders, this);
      this.validateQueryParams = __bind(this.validateQueryParams, this);
      this.validateFormParams = __bind(this.validateFormParams, this);
      this.validateUriParams = __bind(this.validateUriParams, this);
      this.getMethod = __bind(this.getMethod, this);
      this.validateSchema = __bind(this.validateSchema, this);
      this.isJson = __bind(this.isJson, this);
      this.isForm = __bind(this.isForm, this);
      this.validate = __bind(this.validate, this);
    }

    Validation.prototype.validate = function() {
      var method;
      method = this.getMethod();
      this.validateUriParams();
      if (method != null) {
        this.validateQueryParams(method);
        this.validateHeaders(method);
        this.validateFormParams(method);
        if (!this.validateSchema(method)) {
          throw new InvalidBodyError({});
        }
      }
    };

    Validation.prototype.isForm = function() {
      var _ref;
      return (_ref = this.req.headers['content-type']) === 'application/x-www-form-urlencoded' || _ref === 'multipart/form-data';
    };

    Validation.prototype.isJson = function() {
      return this.req.headers['content-type'] === 'application/json' || this.req.headers['content-type'].match('\\+json$');
    };

    Validation.prototype.validateSchema = function(method) {
      var contentType, schemaValidator;
      this.method = method;
      if ((method.body != null) && this.isJson()) {
        contentType = method.body[this.req.headers['content-type']];
        if ((contentType != null) && (contentType.schema != null)) {
          schemaValidator = new SchemaValidator();
          return !(schemaValidator.validate(this.req.body, JSON.parse(contentType.schema))).errors.length;
        }
      }
      return true;
    };

    Validation.prototype.getMethod = function() {
      var method, _i, _len, _ref;
      if (this.resource.methods != null) {
        _ref = this.resource.methods;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          method = _ref[_i];
          if (method.method === this.req.method.toLowerCase()) {
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

    Validation.prototype.validateUriParams = function() {
      var key, ramlUriParameter, reqUriParameters, uri, _ref, _results;
      if (this.resource.uriParameters != null) {
        uri = this.req.url.replace(this.apiPath, '');
        reqUriParameters = this.uriTemplateReader.getUriParametersFor(uri);
        _ref = this.resource.uriParameters;
        _results = [];
        for (key in _ref) {
          ramlUriParameter = _ref[key];
          if (!this.isValid(reqUriParameters[key], ramlUriParameter)) {
            logger.error("Invalid URI Parameter :" + key + " - Request: " + this.req.url + ", Parameter value: " + reqUriParameters[key]);
            logger.data("Validation rule", ramlUriParameter);
            throw new InvalidUriParameterError(this.readValidationInfo(key, reqUriParameters[key], ramlUriParameter));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validation.prototype.validateFormParams = function(method) {
      var formParameters, key, ramlFormParameter, reqFormParam, _results;
      if (this.isForm()) {
        formParameters = method.body['multipart/form-data'];
        if (formParameters == null) {
          formParameters = method.body['application/x-www-form-urlencoded'];
        }
        formParameters = formParameters.formParameters;
        _results = [];
        for (key in formParameters) {
          ramlFormParameter = formParameters[key];
          reqFormParam = this.req.body[key];
          if (!this.isValid(reqFormParam, ramlFormParameter)) {
            logger.error("Invalid Form Parameter :" + key + " - Request: " + this.req.url + ", Parameter value: " + reqFormParam);
            logger.data("Validation Info", ramlFormParameter);
            throw new InvalidFormParameterError(this.readValidationInfo(key, reqFormParam, ramlFormParameter));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validation.prototype.validateQueryParams = function(method) {
      var key, ramlQueryParameter, reqQueryParam, _ref, _results;
      if (method.queryParameters != null) {
        _ref = method.queryParameters;
        _results = [];
        for (key in _ref) {
          ramlQueryParameter = _ref[key];
          reqQueryParam = this.req.query[key];
          if (!this.isValid(reqQueryParam, ramlQueryParameter)) {
            logger.error("Invalid Query Parameter :" + key + " - Request: " + this.req.url + ", Parameter value: " + reqQueryParam);
            logger.data("Validation Info", ramlQueryParameter);
            throw new InvalidQueryParameterError(this.readValidationInfo(key, reqQueryParam, ramlQueryParameter));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validation.prototype.validateHeaders = function(method) {
      var key, ramlHeader, reqHeader, _ref, _results;
      if (method.headers != null) {
        _ref = method.headers;
        _results = [];
        for (key in _ref) {
          ramlHeader = _ref[key];
          reqHeader = this.req.headers[key];
          if (!this.isValid(reqHeader, ramlHeader)) {
            logger.error("Invalid Header :" + key + " - Request: " + this.req.url + ", Header value: " + reqHeader);
            logger.data("Validation Info", ramlHeader);
            throw new InvalidHeaderError(this.readValidationInfo(key, reqHeader, ramlHeader));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validation.prototype.isValid = function(reqParam, ramlParam) {
      this.reqParam = reqParam;
      this.ramlParam = ramlParam;
      return (this.validateRequired(reqParam, ramlParam)) && (this.validateType(reqParam, ramlParam));
    };

    Validation.prototype.validateRequired = function(reqParam, ramlParam) {
      this.reqParam = reqParam;
      this.ramlParam = ramlParam;
      return !ramlParam.required || (reqParam != null);
    };

    Validation.prototype.validateType = function(reqParam, ramlParam) {
      this.reqParam = reqParam;
      this.ramlParam = ramlParam;
      if ('string' === ramlParam.type) {
        return this.validateString(reqParam, ramlParam);
      } else if ('number' === ramlParam.type) {
        return this.validateNumber(reqParam, ramlParam);
      } else if ('integer' === ramlParam.type) {
        return this.validateInt(reqParam, ramlParam);
      } else if ('boolean' === ramlParam.type) {
        return this.validateBoolean(reqParam);
      } else if ('date' === ramlParam.type) {
        return this.validateDate(reqParam);
      } else {
        return true;
      }
    };

    Validation.prototype.validateString = function(reqParam, ramlParam) {
      var matcher;
      if (ramlParam.pattern != null) {
        matcher = new RegExp(ramlParam.pattern, 'ig');
        if (!matcher.test(reqParam)) {
          return false;
        }
      }
      if ((ramlParam.minLength != null) && reqParam.length < ramlParam.minLength) {
        return false;
      }
      if ((ramlParam.maxLength != null) && reqParam.length > ramlParam.maxLength) {
        return false;
      }
      if ((ramlParam["enum"] != null) && !(__indexOf.call(ramlParam["enum"], reqParam) >= 0)) {
        return false;
      }
      return true;
    };

    Validation.prototype.validateNumber = function(reqParam, ramlParam) {
      var number;
      number = parseFloat(reqParam);
      if (isNaN(number)) {
        return false;
      }
      if ((ramlParam.minimum != null) && number < ramlParam.minimum) {
        return false;
      }
      if ((ramlParam.maximum != null) && number > ramlParam.maximum) {
        return false;
      }
      return true;
    };

    Validation.prototype.validateInt = function(reqParam, ramlParam) {
      var number;
      number = parseInt(reqParam);
      if (isNaN(number)) {
        return false;
      }
      if ((ramlParam.minimum != null) && number < ramlParam.minimum) {
        return false;
      }
      if ((ramlParam.maximum != null) && number > ramlParam.maximum) {
        return false;
      }
      return true;
    };

    Validation.prototype.validateBoolean = function(reqParam) {
      return "true" === reqParam || "false" === reqParam;
    };

    Validation.prototype.validateDate = function(reqParam) {
      return moment(reqParam).isValid();
    };

    return Validation;

  })();

  module.exports = Validation;

}).call(this);

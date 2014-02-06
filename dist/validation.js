(function() {
  var OspreyBase, SchemaValidator, Validation,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SchemaValidator = require('jsonschema').Validator;

  OspreyBase = require('./utils/base');

  Validation = (function() {
    function Validation(req, uriTemplateReader, resource, apiPath) {
      this.req = req;
      this.uriTemplateReader = uriTemplateReader;
      this.resource = resource;
      this.apiPath = apiPath;
      this.validateBoolean = __bind(this.validateBoolean, this);
      this.validateInt = __bind(this.validateInt, this);
      this.validateNumber = __bind(this.validateNumber, this);
      this.validateString = __bind(this.validateString, this);
      this.validateType = __bind(this.validateType, this);
      this.validateRequired = __bind(this.validateRequired, this);
      this.validate = __bind(this.validate, this);
      this.validateHeaders = __bind(this.validateHeaders, this);
      this.validateQueryParams = __bind(this.validateQueryParams, this);
      this.validateFormParams = __bind(this.validateFormParams, this);
      this.validateUriParams = __bind(this.validateUriParams, this);
      this.getMethod = __bind(this.getMethod, this);
      this.validateSchema = __bind(this.validateSchema, this);
      this.isJson = __bind(this.isJson, this);
      this.isForm = __bind(this.isForm, this);
      this.isValid = __bind(this.isValid, this);
    }

    Validation.prototype.isValid = function() {
      var method;
      if ((this.resource.uriParameters != null) && !this.validateUriParams()) {
        return false;
      }
      method = this.getMethod();
      if (method != null) {
        if (!this.validateSchema(method)) {
          false;
        }
        if ((method.queryParameters != null) && !this.validateQueryParams(method)) {
          return false;
        }
        if ((method.headers != null) && !this.validateHeaders(method)) {
          return false;
        }
        if (this.isForm() && !this.validateFormParams(method)) {
          return false;
        }
      }
      return true;
    };

    Validation.prototype.isForm = function() {
      var _ref;
      return (_ref = this.req.headers['content-type']) === 'application/x-www-form-urlencoded' || _ref === 'multipart/form-data';
    };

    Validation.prototype.isJson = function() {
      return this.req.headers['content-type'] === 'application/json' || this.req.headers['content-type'].endsWith('+json');
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
      _ref = this.resource.methods;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        if (method.method === this.req.method.toLowerCase()) {
          return method;
        }
      }
      return null;
    };

    Validation.prototype.validateUriParams = function() {
      var key, ramlUriParameter, reqUriParameters, uri, _ref;
      uri = this.req.url.replace(this.apiPath, '');
      reqUriParameters = this.uriTemplateReader.getUriParametersFor(uri);
      _ref = this.resource.uriParameters;
      for (key in _ref) {
        ramlUriParameter = _ref[key];
        if (!this.validate(reqUriParameters[key], ramlUriParameter)) {
          return false;
        }
      }
      return true;
    };

    Validation.prototype.validateFormParams = function(method) {
      var key, ramlFormParameter, reqFormParam, _ref;
      this.method = method;
      _ref = method.body.formParameters;
      for (key in _ref) {
        ramlFormParameter = _ref[key];
        reqFormParam = this.req.body[key];
        if (!this.validate(reqFormParam, ramlFormParameter)) {
          return false;
        }
      }
      return true;
    };

    Validation.prototype.validateQueryParams = function(method) {
      var key, ramlQueryParameter, reqQueryParam, _ref;
      this.method = method;
      _ref = method.queryParameters;
      for (key in _ref) {
        ramlQueryParameter = _ref[key];
        reqQueryParam = this.req.query[key];
        if (!this.validate(reqQueryParam, ramlQueryParameter)) {
          return false;
        }
      }
      return true;
    };

    Validation.prototype.validateHeaders = function(method) {
      var key, ramlHeader, reqHeader, _ref;
      this.method = method;
      _ref = method.headers;
      for (key in _ref) {
        ramlHeader = _ref[key];
        reqHeader = this.req.headers[key];
        if (!this.validate(reqHeader, ramlHeader)) {
          return false;
        }
      }
      return true;
    };

    Validation.prototype.validate = function(reqParam, ramlParam) {
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
      } else {
        return true;
      }
    };

    Validation.prototype.validateString = function(reqParam, ramlParam) {
      var _ref;
      this.reqParam = reqParam;
      this.ramlParam = ramlParam;
      if ((ramlParam.pattern != null) && reqParam.match(ramlParam.pattern)) {
        return false;
      }
      if ((ramlParam.minLength != null) && reqParam.length < ramlParam.minLength) {
        return false;
      }
      if ((ramlParam.maxLength != null) && reqParam.length > ramlParam.maxLength) {
        return false;
      }
      if ((ramlParam.enumeration != null) && (_ref = !ramlParam.enumeration, __indexOf.call(ramlParam.enumeration, _ref) >= 0)) {
        return false;
      }
      return true;
    };

    Validation.prototype.validateNumber = function(reqParam, ramlParam) {
      var e, number;
      this.reqParam = reqParam;
      this.ramlParam = ramlParam;
      try {
        number = parseFloat(reqParam);
      } catch (_error) {
        e = _error;
        false;
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
      var e, number;
      this.reqParam = reqParam;
      this.ramlParam = ramlParam;
      try {
        number = parseInt(reqParam);
      } catch (_error) {
        e = _error;
        false;
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
      this.reqParam = reqParam;
      return "true" === reqParam || "false" === reqParam;
    };

    return Validation;

  })();

  module.exports = Validation;

}).call(this);

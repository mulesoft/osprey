(function() {
  var HttpUtils, InvalidAcceptTypeError, InvalidContentTypeError, RamlHelper, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  InvalidAcceptTypeError = require('../errors/invalid-accept-type-error');

  InvalidContentTypeError = require('../errors/invalid-content-type-error');

  RamlHelper = require('../utils/raml-helper');

  HttpUtils = (function(_super) {
    __extends(HttpUtils, _super);

    function HttpUtils() {
      _ref = HttpUtils.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HttpUtils.prototype.readStatusCode = function(methodInfo) {
      var key, statusCode;
      statusCode = 200;
      for (key in methodInfo.responses) {
        statusCode = key;
        break;
      }
      return Number(statusCode);
    };

    HttpUtils.prototype.setDefaultHeaders = function(res, methodInfo) {
      var name, statusCode, value, _ref1, _ref2, _ref3, _results;
      statusCode = this.readStatusCode(methodInfo);
      _ref3 = (_ref1 = methodInfo.responses) != null ? (_ref2 = _ref1[statusCode]) != null ? _ref2.headers : void 0 : void 0;
      _results = [];
      for (name in _ref3) {
        value = _ref3[name];
        if (value["default"] != null) {
          _results.push(res.set(name, value["default"]));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    HttpUtils.prototype.negotiateContentType = function(req, res, methodInfo) {
      var isValid, mimeType;
      isValid = false;
      for (mimeType in methodInfo.body) {
        if (req.is(mimeType) || (req.get('Content-Type') == null)) {
          isValid = true;
          return;
        }
      }
      if (!isValid) {
        throw new InvalidContentTypeError;
      }
    };

    HttpUtils.prototype.negotiateAcceptType = function(req, res, methodInfo, customHandler) {
      var isValid, mimeType, response, statusCode, _ref1, _ref2, _ref3, _ref4, _ref5;
      statusCode = this.readStatusCode(methodInfo);
      isValid = false;
      response = {};
      for (mimeType in (_ref1 = methodInfo.responses) != null ? (_ref2 = _ref1[statusCode]) != null ? _ref2.body : void 0 : void 0) {
        if (req.accepts(mimeType)) {
          res.set('Content-Type', mimeType);
          response = (_ref3 = methodInfo.responses[statusCode].body[mimeType]) != null ? _ref3.example : void 0;
          isValid = true;
          break;
        }
      }
      if (!isValid && (((_ref4 = methodInfo.responses) != null ? (_ref5 = _ref4[statusCode]) != null ? _ref5.body : void 0 : void 0) != null)) {
        throw new InvalidAcceptTypeError;
      }
      if (customHandler) {
        return customHandler(req, res);
      } else {
        return res.status(statusCode).send(response);
      }
    };

    return HttpUtils;

  })(RamlHelper);

  module.exports = HttpUtils;

}).call(this);

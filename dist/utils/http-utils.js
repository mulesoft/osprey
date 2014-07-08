(function() {
  var HttpUtils, InvalidAcceptTypeError, InvalidContentTypeError, RamlHelper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  InvalidAcceptTypeError = require('../errors/invalid-accept-type-error');

  InvalidContentTypeError = require('../errors/invalid-content-type-error');

  RamlHelper = require('../utils/raml-helper');

  HttpUtils = (function(_super) {
    __extends(HttpUtils, _super);

    function HttpUtils() {
      return HttpUtils.__super__.constructor.apply(this, arguments);
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
      var name, statusCode, value, _ref, _ref1, _ref2, _results;
      statusCode = this.readStatusCode(methodInfo);
      _ref2 = (_ref = methodInfo.responses) != null ? (_ref1 = _ref[statusCode]) != null ? _ref1.headers : void 0 : void 0;
      _results = [];
      for (name in _ref2) {
        value = _ref2[name];
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

    HttpUtils.prototype.negotiateAcceptType = function(req, res, next, methodInfo, customHandler) {
      var isValid, mimeType, response, statusCode, _ref, _ref1, _ref2, _ref3, _ref4;
      statusCode = this.readStatusCode(methodInfo);
      isValid = false;
      response = {};
      for (mimeType in (_ref = methodInfo.responses) != null ? (_ref1 = _ref[statusCode]) != null ? _ref1.body : void 0 : void 0) {
        if (req.accepts(mimeType)) {
          res.set('Content-Type', mimeType);
          response = (_ref2 = methodInfo.responses[statusCode].body[mimeType]) != null ? _ref2.example : void 0;
          isValid = true;
          break;
        }
      }
      if (!isValid && (((_ref3 = methodInfo.responses) != null ? (_ref4 = _ref3[statusCode]) != null ? _ref4.body : void 0 : void 0) != null)) {
        throw new InvalidAcceptTypeError;
      }
      if (customHandler) {
        return customHandler(req, res, next);
      } else {
        return res.status(statusCode).send(response);
      }
    };

    return HttpUtils;

  })(RamlHelper);

  module.exports = HttpUtils;

}).call(this);

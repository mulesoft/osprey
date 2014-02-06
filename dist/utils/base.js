(function() {
  var HttpUtils, OspreyBase, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  HttpUtils = require('../utils/http-utils');

  OspreyBase = (function(_super) {
    __extends(OspreyBase, _super);

    function OspreyBase() {
      _ref = OspreyBase.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    OspreyBase.prototype.methodLookup = function(resources, httpMethod, uri) {
      var methodInfo, _ref1;
      if (((_ref1 = resources[uri]) != null ? _ref1.methods : void 0) != null) {
        methodInfo = resources[uri].methods.filter(function(method) {
          return method.method === httpMethod;
        });
      }
      if ((methodInfo != null) && methodInfo.length) {
        return methodInfo[0];
      } else {
        return null;
      }
    };

    OspreyBase.prototype.resourceLookup = function(routes, resources, req) {
      var result;
      return result = routes[req.method.toLowerCase()].filter(function(route) {
        var _ref1;
        return (_ref1 = req.url.match(route.regexp)) != null ? _ref1.length : void 0;
      });
    };

    OspreyBase.prototype.readStatusCode = function(methodInfo) {
      var key, statusCode;
      statusCode = 200;
      for (key in methodInfo.responses) {
        statusCode = key;
        break;
      }
      return Number(statusCode);
    };

    return OspreyBase;

  })(HttpUtils);

  module.exports = OspreyBase;

}).call(this);

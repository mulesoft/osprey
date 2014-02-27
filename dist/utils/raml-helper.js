(function() {
  var HttpUtils, RamlHelper;

  HttpUtils = require('../utils/http-utils');

  RamlHelper = (function() {
    function RamlHelper() {}

    RamlHelper.prototype.methodLookup = function(resources, httpMethod, uri) {
      var methodInfo, _ref;
      if (((_ref = resources[uri]) != null ? _ref.methods : void 0) != null) {
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

    RamlHelper.prototype.resourceLookup = function(routes, resources, req) {
      var result;
      return result = routes[req.method.toLowerCase()].filter(function(route) {
        var _ref;
        return (_ref = req.url.match(route.regexp)) != null ? _ref.length : void 0;
      });
    };

    RamlHelper.prototype.readStatusCode = function(methodInfo) {
      var key, statusCode;
      statusCode = 200;
      for (key in methodInfo.responses) {
        statusCode = key;
        break;
      }
      return Number(statusCode);
    };

    return RamlHelper;

  })();

  module.exports = RamlHelper;

}).call(this);

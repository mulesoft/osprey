(function() {
  var HttpUtils;

  HttpUtils = (function() {
    function HttpUtils() {}

    HttpUtils.prototype.readStatusCode = function(methodInfo) {
      var key, statusCode;
      statusCode = 200;
      for (key in methodInfo.responses) {
        statusCode = key;
        break;
      }
      return Number(statusCode);
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
        return res.send(415);
      }
    };

    HttpUtils.prototype.negotiateAcceptType = function(req, res, methodInfo, customHandler) {
      var isValid, mimeType, response, statusCode;
      statusCode = this.readStatusCode(methodInfo);
      isValid = false;
      response = null;
      for (mimeType in methodInfo.responses[statusCode].body) {
        if (req.accepts(mimeType)) {
          res.set('Content-Type', mimeType);
          response = methodInfo.responses[statusCode].body[mimeType].example;
          isValid = true;
          break;
        }
      }
      if (!isValid && (methodInfo.responses[statusCode].body != null)) {
        res.send(406);
      }
      if (customHandler) {
        return customHandler(req, res);
      } else {
        return res.send(response || statusCode);
      }
    };

    return HttpUtils;

  })();

  module.exports = HttpUtils;

}).call(this);

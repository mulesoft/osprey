(function() {
  var HeadHandler, HttpUtils, MockHeadHandler, helper, logger,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  HttpUtils = require('../utils/http-utils');

  helper = require('../utils/handler-utils');

  logger = require('../utils/logger');

  MockHeadHandler = (function(_super) {
    __extends(MockHeadHandler, _super);

    function MockHeadHandler() {
      return MockHeadHandler.__super__.constructor.apply(this, arguments);
    }

    MockHeadHandler.prototype.resolve = function(req, res, next, methodInfo) {
      logger.debug("Mock resolved - HEAD " + req.url);
      this.setDefaultHeaders(res, methodInfo);
      return res.send(this.readStatusCode(methodInfo));
    };

    return MockHeadHandler;

  })(HttpUtils);

  HeadHandler = (function(_super) {
    __extends(HeadHandler, _super);

    function HeadHandler(apiPath, context, resources) {
      this.apiPath = apiPath;
      this.context = context;
      this.resources = resources;
    }

    HeadHandler.prototype.resolve = function(uriTemplate, handlers) {
      return helper.resolveWithMiddlewares('head', this.context, "" + this.apiPath + uriTemplate, handlers, function(handler) {
        return function(req, res, next) {
          return handler(req, res);
        };
      });
    };

    return HeadHandler;

  })(HttpUtils);

  exports.MockHandler = MockHeadHandler;

  exports.Handler = HeadHandler;

}).call(this);

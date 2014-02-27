(function() {
  var HeadHandler, HttpUtils, MockHeadHandler, logger, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HttpUtils = require('../utils/http-utils');

  logger = require('../utils/logger');

  MockHeadHandler = (function(_super) {
    __extends(MockHeadHandler, _super);

    function MockHeadHandler() {
      _ref = MockHeadHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MockHeadHandler.prototype.resolve = function(req, res, methodInfo) {
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
      this.resolve = __bind(this.resolve, this);
    }

    HeadHandler.prototype.resolve = function(uriTemplate, handler) {
      var template;
      template = "" + this.apiPath + uriTemplate;
      return this.context.head(template, function(req, res) {
        return handler(req, res);
      });
    };

    return HeadHandler;

  })(HttpUtils);

  exports.MockHandler = MockHeadHandler;

  exports.Handler = HeadHandler;

}).call(this);

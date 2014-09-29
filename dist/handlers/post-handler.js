(function() {
  var HttpUtils, MockPostHandler, PostHandler, helper, logger,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HttpUtils = require('../utils/http-utils');

  helper = require('../utils/handler-utils');

  logger = require('../utils/logger');

  MockPostHandler = (function(_super) {
    __extends(MockPostHandler, _super);

    function MockPostHandler() {
      return MockPostHandler.__super__.constructor.apply(this, arguments);
    }

    MockPostHandler.prototype.resolve = function(req, res, next, methodInfo) {
      logger.debug("Mock resolved - POST " + req.url);
      this.setDefaultHeaders(res, methodInfo);
      this.negotiateContentType(req, res, methodInfo);
      return this.negotiateAcceptType(req, res, next, methodInfo);
    };

    return MockPostHandler;

  })(HttpUtils);

  PostHandler = (function(_super) {
    __extends(PostHandler, _super);

    function PostHandler(apiPath, context, resources) {
      this.apiPath = apiPath;
      this.context = context;
      this.resources = resources;
      this.resolve = __bind(this.resolve, this);
    }

    PostHandler.prototype.resolve = function(uriTemplate, handlers) {
      return helper.resolveWithMiddlewares('post', this.context, "" + this.apiPath + uriTemplate, handlers, (function(_this) {
        return function(handler) {
          return function(req, res, next) {
            var methodInfo;
            methodInfo = _this.methodLookup(_this.resources, 'post', uriTemplate);
            _this.negotiateContentType(req, res, methodInfo);
            return _this.negotiateAcceptType(req, res, next, methodInfo, handler);
          };
        };
      })(this));
    };

    return PostHandler;

  })(HttpUtils);

  exports.MockHandler = MockPostHandler;

  exports.Handler = PostHandler;

}).call(this);

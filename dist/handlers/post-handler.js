(function() {
  var HttpUtils, MockPostHandler, PostHandler, logger, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HttpUtils = require('../utils/http-utils');

  logger = require('../utils/logger');

  MockPostHandler = (function(_super) {
    __extends(MockPostHandler, _super);

    function MockPostHandler() {
      _ref = MockPostHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MockPostHandler.prototype.resolve = function(req, res, methodInfo) {
      logger.debug("Mock resolved - POST " + req.url);
      this.setDefaultHeaders(res, methodInfo);
      this.negotiateContentType(req, res, methodInfo);
      return this.negotiateAcceptType(req, res, methodInfo);
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

    PostHandler.prototype.resolve = function(uriTemplate, handler) {
      var template,
        _this = this;
      template = "" + this.apiPath + uriTemplate;
      return this.context.post(template, function(req, res) {
        var methodInfo;
        methodInfo = _this.methodLookup(_this.resources, 'post', uriTemplate);
        _this.negotiateContentType(req, res, methodInfo);
        return _this.negotiateAcceptType(req, res, methodInfo, handler);
      });
    };

    return PostHandler;

  })(HttpUtils);

  exports.MockHandler = MockPostHandler;

  exports.Handler = PostHandler;

}).call(this);

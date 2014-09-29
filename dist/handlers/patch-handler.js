(function() {
  var HttpUtils, MockPatchHandler, PatchHandler, helper, logger,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HttpUtils = require('../utils/http-utils');

  helper = require('../utils/handler-utils');

  logger = require('../utils/logger');

  MockPatchHandler = (function(_super) {
    __extends(MockPatchHandler, _super);

    function MockPatchHandler() {
      return MockPatchHandler.__super__.constructor.apply(this, arguments);
    }

    MockPatchHandler.prototype.resolve = function(req, res, next, methodInfo) {
      logger.debug("Mock resolved - PATCH " + req.url);
      this.setDefaultHeaders(res, methodInfo);
      this.negotiateContentType(req, res, methodInfo);
      return this.negotiateAcceptType(req, res, next, methodInfo);
    };

    return MockPatchHandler;

  })(HttpUtils);

  PatchHandler = (function(_super) {
    __extends(PatchHandler, _super);

    function PatchHandler(apiPath, context, resources) {
      this.apiPath = apiPath;
      this.context = context;
      this.resources = resources;
      this.resolve = __bind(this.resolve, this);
    }

    PatchHandler.prototype.resolve = function(uriTemplate, handlers) {
      return helper.resolveWithMiddlewares('patch', this.context, "" + this.apiPath + uriTemplate, handlers, (function(_this) {
        return function(handler) {
          return function(req, res, next) {
            var methodInfo;
            methodInfo = _this.methodLookup(_this.resources, 'patch', uriTemplate);
            _this.negotiateContentType(req, res, methodInfo);
            return _this.negotiateAcceptType(req, res, next, methodInfo, handler);
          };
        };
      })(this));
    };

    return PatchHandler;

  })(HttpUtils);

  exports.MockHandler = MockPatchHandler;

  exports.Handler = PatchHandler;

}).call(this);

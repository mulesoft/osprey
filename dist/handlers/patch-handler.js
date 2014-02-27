(function() {
  var HttpUtils, MockPatchHandler, PatchHandler, logger, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HttpUtils = require('../utils/http-utils');

  logger = require('../utils/logger');

  MockPatchHandler = (function(_super) {
    __extends(MockPatchHandler, _super);

    function MockPatchHandler() {
      _ref = MockPatchHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MockPatchHandler.prototype.resolve = function(req, res, methodInfo) {
      logger.debug("Mock resolved - PATCH " + req.url);
      this.setDefaultHeaders(res, methodInfo);
      this.negotiateContentType(req, res, methodInfo);
      return this.negotiateAcceptType(req, res, methodInfo);
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

    PatchHandler.prototype.resolve = function(uriTemplate, handler) {
      var template,
        _this = this;
      template = "" + this.apiPath + uriTemplate;
      return this.context.patch(template, function(req, res) {
        var methodInfo;
        methodInfo = _this.methodLookup(_this.resources, 'patch', uriTemplate);
        _this.negotiateContentType(req, res, methodInfo);
        return _this.negotiateAcceptType(req, res, methodInfo, handler);
      });
    };

    return PatchHandler;

  })(HttpUtils);

  exports.MockHandler = MockPatchHandler;

  exports.Handler = PatchHandler;

}).call(this);

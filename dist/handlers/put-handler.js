(function() {
  var HttpUtils, MockPutHandler, PutHandler, logger, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HttpUtils = require('../utils/http-utils');

  logger = require('../utils/logger');

  MockPutHandler = (function(_super) {
    __extends(MockPutHandler, _super);

    function MockPutHandler() {
      _ref = MockPutHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MockPutHandler.prototype.resolve = function(req, res, methodInfo) {
      logger.debug("Mock resolved - PUT " + req.url);
      this.setDefaultHeaders(res, methodInfo);
      this.negotiateContentType(req, res, methodInfo);
      return this.negotiateAcceptType(req, res, methodInfo);
    };

    return MockPutHandler;

  })(HttpUtils);

  PutHandler = (function(_super) {
    __extends(PutHandler, _super);

    function PutHandler(apiPath, context, resources) {
      this.apiPath = apiPath;
      this.context = context;
      this.resources = resources;
      this.resolve = __bind(this.resolve, this);
    }

    PutHandler.prototype.resolve = function(uriTemplate, handler) {
      var template,
        _this = this;
      template = "" + this.apiPath + uriTemplate;
      return this.context.put(template, function(req, res) {
        var methodInfo;
        methodInfo = _this.methodLookup(_this.resources, 'put', uriTemplate);
        _this.negotiateContentType(req, res, methodInfo);
        return _this.negotiateAcceptType(req, res, methodInfo, handler);
      });
    };

    return PutHandler;

  })(HttpUtils);

  exports.MockHandler = MockPutHandler;

  exports.Handler = PutHandler;

}).call(this);

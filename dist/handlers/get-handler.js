(function() {
  var GetHandler, HttpUtils, MockGetHandler, helper, logger,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HttpUtils = require('../utils/http-utils');

  helper = require('../utils/handler-utils');

  logger = require('../utils/logger');

  MockGetHandler = (function(_super) {
    __extends(MockGetHandler, _super);

    function MockGetHandler() {
      return MockGetHandler.__super__.constructor.apply(this, arguments);
    }

    MockGetHandler.prototype.resolve = function(req, res, next, methodInfo) {
      logger.debug("Mock resolved - GET " + req.url);
      this.setDefaultHeaders(res, methodInfo);
      return this.negotiateAcceptType(req, res, next, methodInfo);
    };

    return MockGetHandler;

  })(HttpUtils);

  GetHandler = (function(_super) {
    __extends(GetHandler, _super);

    function GetHandler(apiPath, context, resources) {
      this.apiPath = apiPath;
      this.context = context;
      this.resources = resources;
      this.resolve = __bind(this.resolve, this);
    }

    GetHandler.prototype.resolve = function(uriTemplate, handlers) {
      return helper.resolveWithMiddlewares('get', this.context, "" + this.apiPath + uriTemplate, handlers, (function(_this) {
        return function(handler) {
          return function(req, res, next) {
            var methodInfo;
            methodInfo = _this.methodLookup(_this.resources, 'get', uriTemplate);
            return _this.negotiateAcceptType(req, res, next, methodInfo, handler);
          };
        };
      })(this));
    };

    return GetHandler;

  })(HttpUtils);

  exports.MockHandler = MockGetHandler;

  exports.Handler = GetHandler;

}).call(this);

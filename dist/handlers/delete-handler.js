(function() {
  var DeleteHandler, HttpUtils, MockDeleteHandler, logger, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HttpUtils = require('../utils/http-utils');

  logger = require('../utils/logger');

  MockDeleteHandler = (function(_super) {
    __extends(MockDeleteHandler, _super);

    function MockDeleteHandler() {
      _ref = MockDeleteHandler.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MockDeleteHandler.prototype.resolve = function(req, res, methodInfo) {
      logger.debug("Mock resolved - DELETE " + req.url);
      this.setDefaultHeaders(res, methodInfo);
      return res.send(this.readStatusCode(methodInfo));
    };

    return MockDeleteHandler;

  })(HttpUtils);

  DeleteHandler = (function(_super) {
    __extends(DeleteHandler, _super);

    function DeleteHandler(apiPath, context, resources) {
      this.apiPath = apiPath;
      this.context = context;
      this.resources = resources;
      this.resolve = __bind(this.resolve, this);
    }

    DeleteHandler.prototype.resolve = function(uriTemplate, handler) {
      var template;
      template = "" + this.apiPath + uriTemplate;
      return this.context["delete"](template, function(req, res) {
        return handler(req, res);
      });
    };

    return DeleteHandler;

  })(HttpUtils);

  exports.MockHandler = MockDeleteHandler;

  exports.Handler = DeleteHandler;

}).call(this);

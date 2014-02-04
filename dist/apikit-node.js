(function() {
  var ApiKit, UriTemplateReader, ValidationError, parser,
    _this = this;

  UriTemplateReader = require('./uri-template-reader');

  parser = require('./wrapper');

  ApiKit = require('./apikit');

  ValidationError = require('./exceptions/validation-error');

  exports.register = function(apiPath, context, settings) {
    _this.apikit = new ApiKit(apiPath, context, settings);
    return _this.apikit.register();
  };

  exports.route = function(apiPath, context, settings) {
    this.apikit = new ApiKit(apiPath, context, settings);
    return this.apikit.route(settings.enableMocks);
  };

  exports.validations = function(apiPath, context, settings) {
    this.apikit = new ApiKit(apiPath, context, settings);
    return this.apikit.validations();
  };

  exports.exceptionHandler = function(apiPath, context, settings) {
    this.apikit = new ApiKit(apiPath, context, settings);
    return this.apikit.exceptionHandler(settings);
  };

  exports.get = function(uriTemplate, handler) {
    return _this.apikit.get(uriTemplate, handler);
  };

  exports.post = function(uriTemplate, handler) {
    return _this.apikit.post(uriTemplate, handler);
  };

  exports.put = function(uriTemplate, handler) {
    return _this.apikit.put(uriTemplate, handler);
  };

  exports["delete"] = function(uriTemplate, handler) {
    return _this.apikit["delete"](uriTemplate, handler);
  };

  exports.patch = function(uriTemplate, handler) {
    return _this.apikit.patch(uriTemplate, handler);
  };

  exports.head = function(uriTemplate, handler) {
    return _this.apikit.head(uriTemplate, handler);
  };

}).call(this);

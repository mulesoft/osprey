(function() {
  var ApiKit, UriTemplateReader, parser,
    _this = this;

  UriTemplateReader = require('./uri-template-reader');

  parser = require('./wrapper');

  ApiKit = require('./apikit');

  exports.create = function(apiPath, context, settings) {
    _this.apikit = new ApiKit(apiPath, context, settings);
    _this.apikit.register();
    return _this.apikit;
  };

  exports.route = function(apiPath, context, settings) {
    this.apikit = new ApiKit(apiPath, context, settings);
    return this.apikit.route(settings.enableMocks);
  };

  exports.validations = function(apiPath, context, settings) {
    this.apikit = new ApiKit(apiPath, context, settings);
    return this.apikit.validations();
  };

}).call(this);

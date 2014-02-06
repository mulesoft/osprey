(function() {
  var Osprey, UriTemplateReader, parser,
    _this = this;

  UriTemplateReader = require('./uri-template-reader');

  parser = require('./wrapper');

  Osprey = require('./osprey');

  exports.create = function(apiPath, context, settings) {
    _this.osprey = new Osprey(apiPath, context, settings);
    _this.osprey.register();
    return _this.osprey;
  };

  exports.route = function(apiPath, context, settings) {
    this.osprey = new Osprey(apiPath, context, settings);
    return this.osprey.route(settings.enableMocks);
  };

  exports.validations = function(apiPath, context, settings) {
    this.osprey = new Osprey(apiPath, context, settings);
    return this.osprey.validations();
  };

}).call(this);

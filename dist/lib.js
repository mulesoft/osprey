(function() {
  var Osprey, UriTemplateReader, logger, parser;

  UriTemplateReader = require('./uri-template-reader');

  parser = require('./wrapper');

  Osprey = require('./osprey');

  UriTemplateReader = require('./uri-template-reader');

  logger = require('./utils/logger');

  exports.create = function(apiPath, context, settings, errorCallback) {
    var osprey;
    osprey = new Osprey(apiPath, context, settings, logger);
    logger.setLevel(settings.logLevel);
    osprey.registerConsole();
    parser.loadRaml(settings.ramlFile, logger, function(wrapper) {
      var resources, uriTemplateReader;
      resources = wrapper.getResources();
      uriTemplateReader = new UriTemplateReader(wrapper.getUriTemplates());
      return osprey.load(null, uriTemplateReader, resources);
    }, function(error) {
      if ((errorCallback != null) && typeof errorCallback === 'function') {
        return errorCallback(error, osprey, context);
      }
    });
    return osprey;
  };

}).call(this);

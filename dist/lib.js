(function() {
  var Osprey, UriTemplateReader, logger, parser, path;

  UriTemplateReader = require('./uri-template-reader');

  parser = require('./wrapper');

  Osprey = require('./osprey');

  UriTemplateReader = require('./uri-template-reader');

  logger = require('./utils/logger');

  path = require('path');

  exports.create = function(apiPath, context, settings) {
    var osprey;
    if (!settings.ramlFile) {
      settings.ramlFile = path.join(process.cwd(), '/src/assets/raml/api.raml');
    }
    osprey = new Osprey(apiPath, context, settings, logger);
    logger.setLevel(settings.logLevel);
    osprey.registerConsole();
    parser.loadRaml(settings.ramlFile, logger, function(wrapper) {
      var resources, uriTemplateReader;
      resources = wrapper.getResources();
      uriTemplateReader = new UriTemplateReader(wrapper.getUriTemplates());
      return osprey.load(null, uriTemplateReader, resources);
    });
    return osprey;
  };

}).call(this);

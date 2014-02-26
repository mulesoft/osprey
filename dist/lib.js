(function() {
  var Osprey, OspreyRouter, UriTemplateReader, logger, parser;

  UriTemplateReader = require('./uri-template-reader');

  parser = require('./wrapper');

  Osprey = require('./osprey');

  UriTemplateReader = require('./uri-template-reader');

  OspreyRouter = require('./router');

  logger = require('./utils/logger');

  exports.create = function(apiPath, context, settings) {
    var osprey;
    osprey = new Osprey(apiPath, context, settings, logger);
    logger.setLevel(settings.logLevel);
    osprey.registerConsole();
    parser.loadRaml(settings.ramlFile, logger, function(wrapper) {
      var resources, router, templates, uriTemplateReader;
      resources = wrapper.getResources();
      templates = wrapper.getUriTemplates();
      uriTemplateReader = new UriTemplateReader(templates);
      router = new OspreyRouter(apiPath, context, resources, uriTemplateReader, logger);
      return osprey.register(router, uriTemplateReader, resources);
    });
    return osprey;
  };

}).call(this);

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

  exports.route = function(apiPath, context, settings) {
    var osprey;
    osprey = new Osprey(apiPath, context, settings, logger);
    logger.setLevel(settings.logLevel);
    parser.loadRaml(settings.ramlFile, logger, function(wrapper) {
      var resources, router, templates, uriTemplateReader;
      resources = wrapper.getResources();
      templates = wrapper.getUriTemplates();
      uriTemplateReader = new UriTemplateReader(templates);
      router = new OspreyRouter(apiPath, context, resources, uriTemplateReader, logger);
      return context.use(osprey.route(router, settings.enableMocks));
    });
    return osprey;
  };

  exports.validations = function(apiPath, context, settings) {
    logger.setLevel(settings.logLevel);
    return parser.loadRaml(settings.ramlFile, logger, function(wrapper) {
      var osprey, resources, templates, uriTemplateReader;
      resources = wrapper.getResources();
      templates = wrapper.getUriTemplates();
      uriTemplateReader = new UriTemplateReader(templates);
      osprey = new Osprey(apiPath, context, settings, logger);
      return context.use(osprey.validations(uriTemplateReader, resources));
    });
  };

  exports.exceptionHandler = function(apiPath, context, settings) {
    var osprey;
    osprey = new Osprey(apiPath, context, settings);
    return context.use(osprey.exceptionHandler(settings));
  };

}).call(this);

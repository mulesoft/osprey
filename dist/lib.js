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
    osprey = new Osprey(apiPath, context, settings);
    logger.setLevel(settings.logLevel);
    parser.loadRaml(settings.ramlFile, function(wrapper) {
      var resources, router, templates, uriTemplateReader;
      resources = wrapper.getResources();
      templates = wrapper.getUriTemplates();
      uriTemplateReader = new UriTemplateReader(templates);
      router = new OspreyRouter(apiPath, context, resources, uriTemplateReader);
      osprey.register(router, uriTemplateReader, resources);
      return osprey.init(router);
    });
    return osprey;
  };

  exports.route = function(apiPath, context, settings) {
    var osprey;
    osprey = new Osprey(apiPath, context, settings);
    logger.setLevel(settings.logLevel);
    parser.loadRaml(settings.ramlFile, function(wrapper) {
      var resources, router, templates, uriTemplateReader;
      resources = wrapper.getResources();
      templates = wrapper.getUriTemplates();
      uriTemplateReader = new UriTemplateReader(templates);
      router = new OspreyRouter(apiPath, context, resources, uriTemplateReader);
      context.use(osprey.route(router, settings.enableMocks));
      return osprey.init(router);
    });
    return osprey;
  };

  exports.validations = function(apiPath, context, settings) {
    logger.setLevel(settings.logLevel);
    return parser.loadRaml(settings.ramlFile, function(wrapper) {
      var osprey, resources, templates, uriTemplateReader;
      resources = wrapper.getResources();
      templates = wrapper.getUriTemplates();
      uriTemplateReader = new UriTemplateReader(templates);
      osprey = new Osprey(apiPath, context, settings);
      return context.use(osprey.validations(uriTemplateReader, resources));
    });
  };

}).call(this);

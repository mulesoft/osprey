(function() {
  var Osprey, UriTemplateReader, express, logger, parser, path;

  UriTemplateReader = require('./uri-template-reader');

  parser = require('./wrapper');

  Osprey = require('./osprey');

  UriTemplateReader = require('./uri-template-reader');

  logger = require('./utils/logger');

  path = require('path');

  express = require('express');

  exports.create = function(apiPath, context, settings) {
    var osprey, ospreyApp;
    if (!settings.ramlFile) {
      settings.ramlFile = path.join(process.cwd(), '/src/assets/raml/api.raml');
    }
    ospreyApp = express();
    context.use(apiPath, ospreyApp);
    osprey = new Osprey(apiPath, ospreyApp, settings, logger, context);
    logger.setLevel(settings.logLevel);
    parser.loadRaml(settings.ramlFile, logger, function(wrapper) {
      var resources, uriTemplateReader;
      resources = wrapper.getResources();
      uriTemplateReader = new UriTemplateReader(wrapper.getUriTemplates());
      osprey.load(null, uriTemplateReader, resources);
      return osprey.registerConsole();
    });
    return osprey;
  };

}).call(this);

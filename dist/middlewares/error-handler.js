(function() {
  var ErrorHandler, errorDefaultSettings;

  errorDefaultSettings = require('../error-default-settings');

  ErrorHandler = (function() {
    function ErrorHandler(apiPath, resources, uriTemplateReader, logger, settings) {
      var key, value;
      this.apiPath = apiPath;
      this.resources = resources;
      this.uriTemplateReader = uriTemplateReader;
      this.logger = logger;
      this.logger.info('Osprey::ExceptionHandler has been initialized successfully');
      for (key in settings) {
        value = settings[key];
        errorDefaultSettings[key] = value;
      }
    }

    ErrorHandler.prototype.exec = function(err, req, res, next) {
      var errorHandler;
      errorHandler = errorDefaultSettings[err.constructor.name];
      if (errorHandler != null) {
        return errorHandler(err, req, res, next);
      } else {
        return next();
      }
    };

    return ErrorHandler;

  })();

  module.exports = ErrorHandler;

}).call(this);

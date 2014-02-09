(function() {
  var colors, logLevel, logger, winston;

  winston = require('winston');

  colors = require('colors');

  colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  });

  logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true
      })
    ],
    levels: {
      info: 2,
      Osprey: 3
    },
    colors: {
      Osprey: 'cyan'
    }
  });

  logLevel = 'off';

  exports.setLevel = function(level) {
    if (level != null) {
      return logLevel = level;
    }
  };

  exports.info = function(message) {
    if (logLevel === 'info' || logLevel === 'debug') {
      return logger.log('Osprey', message.info);
    }
  };

  exports.error = function(message) {
    if (logLevel === 'info' || logLevel === 'debug') {
      return logger.log('Osprey', message.error);
    }
  };

  exports.warn = function(message) {
    if (logLevel === 'info' || logLevel === 'debug') {
      return logger.log('Osprey', message.warn);
    }
  };

  exports.debug = function(message) {
    if (logLevel === 'debug') {
      return logger.log('Osprey', message.debug);
    }
  };

  exports.data = function(description, data) {
    var key, value, _results;
    if (logLevel === 'debug') {
      logger.log('Osprey', description.data);
      _results = [];
      for (key in data) {
        value = data[key];
        _results.push(logger.log('Osprey', ("  " + key + ": " + value).replace(/\n$/, '').data));
      }
      return _results;
    }
  };

}).call(this);

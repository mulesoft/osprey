(function() {
  var colors, logger, winston;

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

  exports.info = function(message) {
    return logger.log('Osprey', message.info);
  };

  exports.error = function(message) {
    return logger.log('Osprey', message.error);
  };

  exports.warn = function(message) {
    return logger.log('Osprey', message.warn);
  };

  exports.help = function(message) {
    return logger.log('Osprey', message.help);
  };

  exports.debug = function(message) {
    return logger.log('Osprey', message.debug);
  };

  exports.data = function(description, data) {
    var key, value, _results;
    logger.log('Osprey', description.data);
    _results = [];
    for (key in data) {
      value = data[key];
      _results.push(logger.log('Osprey', ("  " + key + ": " + value).replace(/\n$/, '').data));
    }
    return _results;
  };

}).call(this);

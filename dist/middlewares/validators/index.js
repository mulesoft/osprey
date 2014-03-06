(function() {
  var fs, lodash, path, validators;

  fs = require('fs');

  path = require('path');

  lodash = require('lodash');

  validators = {};

  fs.readdirSync(__dirname).filter(function(file) {
    return (file !== 'index.coffee' && path.extname(file) === '.coffee') || (file !== 'index.js' && path.extname(file) === '.js');
  }).forEach(function(file) {
    var temp;
    temp = new (require(path.join(__dirname, file)));
    return validators[temp.constructor.name] = new (require(path.join(__dirname, file)));
  });

  module.exports = validators;

}).call(this);

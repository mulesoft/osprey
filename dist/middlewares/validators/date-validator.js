(function() {
  var DateValidator, moment;

  moment = require('moment');

  DateValidator = (function() {
    function DateValidator() {}

    DateValidator.prototype.validate = function(value, rules) {
      if (rules.type !== 'date') {
        return true;
      }
      return moment(value).isValid();
    };

    return DateValidator;

  })();

  module.exports = DateValidator;

}).call(this);

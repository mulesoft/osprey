(function() {
  var IntegerValidator;

  IntegerValidator = (function() {
    function IntegerValidator() {}

    IntegerValidator.prototype.validate = function(value, rules) {
      var number;
      if (rules.type !== 'integer') {
        return true;
      }
      number = parseInt(value);
      if (isNaN(number)) {
        return false;
      }
      if ((rules.minimum != null) && number < rules.minimum) {
        return false;
      }
      if ((rules.maximum != null) && number > rules.maximum) {
        return false;
      }
      return true;
    };

    return IntegerValidator;

  })();

  module.exports = IntegerValidator;

}).call(this);

(function() {
  var NumberValidator;

  NumberValidator = (function() {
    function NumberValidator() {}

    NumberValidator.prototype.validate = function(value, rules) {
      var number;
      if (rules.type !== 'number') {
        return true;
      }
      number = parseFloat(value);
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

    return NumberValidator;

  })();

  module.exports = NumberValidator;

}).call(this);

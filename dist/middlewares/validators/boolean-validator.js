(function() {
  var BooleanValidator;

  BooleanValidator = (function() {
    function BooleanValidator() {}

    BooleanValidator.prototype.validate = function(value, rules) {
      if (rules.type !== 'boolean') {
        return true;
      }
      return "true" === value || "false" === value;
    };

    return BooleanValidator;

  })();

  module.exports = BooleanValidator;

}).call(this);

(function() {
  var StringValidator,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  StringValidator = (function() {
    function StringValidator() {}

    StringValidator.prototype.validate = function(value, rules) {
      var matcher;
      if (rules.type !== 'string') {
        return true;
      }
      if (rules.pattern != null) {
        matcher = new RegExp(rules.pattern, 'ig');
        if (!matcher.test(value)) {
          return false;
        }
      }
      if ((rules.minLength != null) && value.length < rules.minLength) {
        return false;
      }
      if ((rules.maxLength != null) && value.length > rules.maxLength) {
        return false;
      }
      if ((rules["enum"] != null) && !(__indexOf.call(rules["enum"], value) >= 0)) {
        return false;
      }
      return true;
    };

    return StringValidator;

  })();

  module.exports = StringValidator;

}).call(this);

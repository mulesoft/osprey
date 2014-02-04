(function() {
  var ValidationError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ValidationError = (function(_super) {
    __extends(ValidationError, _super);

    function ValidationError() {
      ValidationError.__super__.constructor.apply(this, arguments);
    }

    return ValidationError;

  })(Error);

  module.exports = ValidationError;

}).call(this);

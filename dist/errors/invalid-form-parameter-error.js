(function() {
  var InvalidFormParameterError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  InvalidFormParameterError = (function(_super) {
    __extends(InvalidFormParameterError, _super);

    function InvalidFormParameterError(context) {
      this.context = context;
      InvalidFormParameterError.__super__.constructor.apply(this, arguments);
    }

    return InvalidFormParameterError;

  })(Error);

  module.exports = InvalidFormParameterError;

}).call(this);

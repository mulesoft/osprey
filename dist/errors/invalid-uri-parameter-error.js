(function() {
  var InvalidUriParameterError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  InvalidUriParameterError = (function(_super) {
    __extends(InvalidUriParameterError, _super);

    function InvalidUriParameterError(context) {
      this.context = context;
      InvalidUriParameterError.__super__.constructor.apply(this, arguments);
    }

    return InvalidUriParameterError;

  })(Error);

  module.exports = InvalidUriParameterError;

}).call(this);

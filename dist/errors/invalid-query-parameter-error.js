(function() {
  var InvalidQueryParameterError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  InvalidQueryParameterError = (function(_super) {
    __extends(InvalidQueryParameterError, _super);

    function InvalidQueryParameterError(context) {
      this.context = context;
      InvalidQueryParameterError.__super__.constructor.apply(this, arguments);
    }

    return InvalidQueryParameterError;

  })(Error);

  module.exports = InvalidQueryParameterError;

}).call(this);

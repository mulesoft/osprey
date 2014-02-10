(function() {
  var InvalidHeaderError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  InvalidHeaderError = (function(_super) {
    __extends(InvalidHeaderError, _super);

    function InvalidHeaderError(context) {
      this.context = context;
      InvalidHeaderError.__super__.constructor.apply(this, arguments);
    }

    return InvalidHeaderError;

  })(Error);

  module.exports = InvalidHeaderError;

}).call(this);

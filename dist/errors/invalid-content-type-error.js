(function() {
  var InvalidContentTypeError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  InvalidContentTypeError = (function(_super) {
    __extends(InvalidContentTypeError, _super);

    function InvalidContentTypeError() {
      InvalidContentTypeError.__super__.constructor.apply(this, arguments);
    }

    return InvalidContentTypeError;

  })(Error);

  module.exports = InvalidContentTypeError;

}).call(this);

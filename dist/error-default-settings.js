(function() {
  module.exports = {
    InvalidAcceptTypeError: function(err, req, res) {
      return res.send(406);
    },
    InvalidContentTypeError: function(err, req, res) {
      return res.send(415);
    },
    InvalidUriParameterError: function(err, req, res) {
      return res.send(400);
    },
    InvalidFormParameterError: function(err, req, res) {
      return res.send(400);
    },
    InvalidQueryParameterError: function(err, req, res) {
      return res.send(400);
    },
    InvalidHeaderError: function(err, req, res) {
      return res.send(400);
    },
    InvalidBodyError: function(err, req, res) {
      return res.send(400);
    },
    Error: function(err, req, res) {
      return res.send(500);
    }
  };

}).call(this);

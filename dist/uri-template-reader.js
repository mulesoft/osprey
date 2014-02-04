(function() {
  var UriTemplateReader, utils;

  utils = require('express/lib/utils');

  UriTemplateReader = (function() {
    function UriTemplateReader(templates) {
      this.templates = templates;
      this.generateUriMatchers(this.templates);
    }

    UriTemplateReader.prototype.generateUriMatchers = function(templates) {
      var template, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        _results.push((function(template) {
          var regexp;
          regexp = utils.pathRegexp(template.uriTemplate, [], false, false);
          return template.regexp = regexp;
        })(template));
      }
      return _results;
    };

    UriTemplateReader.prototype.getTemplateFor = function(uri) {
      var template;
      template = this.templates.filter(function(template) {
        var _ref;
        return (_ref = uri.match(template.regexp)) != null ? _ref.length : void 0;
      });
      if ((template != null) && template.length) {
        return template[0];
      } else {
        return null;
      }
    };

    UriTemplateReader.prototype.getUriParametersFor = function(uri) {
      var i, keys, matches, template, uriParameters, _i, _ref;
      template = this.getTemplateFor(uri);
      if (template == null) {
        return null;
      }
      matches = uri.match(template.regexp);
      keys = template.uriTemplate.match(template.regexp);
      if (!(keys.length > 1)) {
        return null;
      }
      uriParameters = {};
      for (i = _i = 1, _ref = keys.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        uriParameters[keys[i].replace(':', '')] = matches[i];
      }
      return uriParameters;
    };

    return UriTemplateReader;

  })();

  module.exports = UriTemplateReader;

}).call(this);

(function() {
  var ParserWrapper, clone, ramlLoader, ramlParser;

  ramlParser = require('raml-parser');

  ParserWrapper = (function() {
    function ParserWrapper(data) {
      this.raml = data;
      this.resources = {};
      this._generateResources();
    }

    ParserWrapper.prototype.getResources = function() {
      return this.resources;
    };

    ParserWrapper.prototype.getUriTemplates = function() {
      var key, resource, templates, _ref;
      templates = [];
      _ref = this.resources;
      for (key in _ref) {
        resource = _ref[key];
        templates.push({
          uriTemplate: key
        });
      }
      return templates;
    };

    ParserWrapper.prototype.getResourcesList = function() {
      var key, resource, resourceCopy, resourceList, _ref;
      resourceList = [];
      _ref = this.resources;
      for (key in _ref) {
        resource = _ref[key];
        resourceCopy = clone(resource);
        resourceCopy.uri = key;
        resourceList.push(resourceCopy);
      }
      return resourceList;
    };

    ParserWrapper.prototype.getProtocols = function() {
      return this.raml.protocols;
    };

    ParserWrapper.prototype.getSecuritySchemes = function() {
      return this.raml.securitySchemes;
    };

    ParserWrapper.prototype.getRaml = function() {
      return this.raml;
    };

    ParserWrapper.prototype._generateResources = function() {
      var x, _i, _len, _ref, _results;
      if (this.raml.resources != null) {
        _ref = this.raml.resources;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(this._processResource(x, this.resources));
        }
        return _results;
      }
    };

    ParserWrapper.prototype._processResource = function(resource, resourceMap, uri) {
      var uriKey, x, _i, _len, _ref, _ref1;
      if (uri == null) {
        uri = resource.relativeUri;
      }
      if (resource.resources != null) {
        _ref = resource.resources;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          this._processResource(x, resourceMap, uri + x.relativeUri);
        }
      }
      uriKey = uri.replace(/{(.*?)}/g, ":$1");
      resourceMap[uriKey] = clone(resource);
      delete resourceMap[uriKey].relativeUri;
      return (_ref1 = resourceMap[uriKey]) != null ? delete _ref1.resources : void 0;
    };

    return ParserWrapper;

  })();

  clone = function(obj) {
    var flags, key, newInstance;
    if ((obj == null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      newInstance[key] = clone(obj[key]);
    }
    return newInstance;
  };

  ramlLoader = function(filePath, logger, onSuccess, onError) {
    return ramlParser.loadFile(filePath).then(function(data) {
      logger.info('RAML successfully loaded');
      return onSuccess(new ParserWrapper(data));
    }, function(error) {
      logger.error("Error when parsing RAML. Message: " + error.message + ", Line: " + error.problem_mark.line + ", Column: " + error.problem_mark.column);
      return onError(error);
    });
  };

  exports.loadRaml = ramlLoader;

}).call(this);

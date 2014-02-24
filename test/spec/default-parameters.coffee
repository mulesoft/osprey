parser = require '../../src/wrapper'
should = require 'should'
Request = require('../mocks/server').request
Logger = require '../mocks/logger'
UriTemplateReader = require '../../src/uri-template-reader'
DefaultParameters = require '../../src/default-parameters'

describe 'OSPREY DEFAULT PARAMETERS', =>
  before (done) =>
    parser.loadRaml "./test/assets/default-parameters.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      done()
  
  describe 'QUERY PARAMETERS', =>
    it 'Should add a query param to the request if it is not present', (done) =>
      # Arrange
      req = new Request 'GET', '/api/resources'
      middleware = new DefaultParameters '/api', @uriTemplateReader, @resources, new Logger
      
      # Act
      middleware.checkDefaults(req, {}, ()-> )

      # Assert
      req.query.param.should.eql 'QUERY PARAMETER'

      done()

    it 'Should use the assigned value', (done) =>
      # Arrange
      req = new Request 'GET', '/api/resources?param=CUSTOM'
      middleware = new DefaultParameters '/api', @uriTemplateReader, @resources, new Logger
      
      # Act
      req.addQueryParameter 'param', 'CUSTOM'
      middleware.checkDefaults(req, {}, ()-> )

      # Assert
      req.query.param.should.eql 'CUSTOM'

      done()

  describe 'FORM PARAMETERS', =>
    it 'Should add a form parameter to the request if it is not present', (done) =>
      # Arrange
      req = new Request 'POST', '/api/resources'
      middleware = new DefaultParameters '/api', @uriTemplateReader, @resources, new Logger
      
      # Act
      req.addHeader 'content-type', 'application/x-www-form-urlencoded'
      middleware.checkDefaults(req, {}, ()-> )

      # Assert
      req.body.param.should.eql 'FORM PARAMETER'

      done()

    it 'Should use the assigned value', (done) =>
      # Arrange
      req = new Request 'POST', '/api/resources'
      middleware = new DefaultParameters '/api', @uriTemplateReader, @resources, new Logger
      
      # Act
      req.addHeader 'content-type', 'application/x-www-form-urlencoded'
      req.addBodyParameter 'param', 'CUSTOM'
      middleware.checkDefaults(req, {}, ()-> )

      # Assert
      req.body.param.should.eql 'CUSTOM'

      done()

  describe 'HEADERS', =>
    it 'Should add a header to the request if it is not present', (done) =>
      # Arrange
      req = new Request 'GET', '/api/resources'
      middleware = new DefaultParameters '/api', @uriTemplateReader, @resources, new Logger
      
      # Act
      middleware.checkDefaults(req, {}, ()-> )

      # Assert
      req.headers.header.should.eql 'HEADER'

      done()

    it 'Should use the assigned value', (done) =>
      # Arrange
      req = new Request 'GET', '/api/resources'
      middleware = new DefaultParameters '/api', @uriTemplateReader, @resources, new Logger
      
      # Act
      req.addHeader 'header', 'CUSTOM'
      middleware.checkDefaults(req, {}, ()-> )

      # Assert
      req.headers.header.should.eql 'CUSTOM'

      done()
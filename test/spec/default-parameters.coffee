parser = require '../../src/wrapper'
should = require 'should'
Request = require('../mocks/server').request
Logger = require '../mocks/logger'
UriTemplateReader = require '../../src/uri-template-reader'
DefaultParameters = require '../../src/middlewares/default-parameters'

describe 'OSPREY DEFAULT PARAMETERS', =>
  before () =>
    parser.loadRaml "./test/assets/default-parameters.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  describe 'QUERY PARAMETERS', =>
    it 'Should add a query param to the request if it is not present', () =>
      # Arrange
      req = new Request 'GET', '/api/resources'
      middleware = new DefaultParameters '/api', {}, {}, @resources, @uriTemplateReader, new Logger

      # Act
      middleware.exec(req, {}, ()-> )

      # Assert
      req.query.param.should.eql 'QUERY PARAMETER'

    it 'Should use the assigned value', () =>
      # Arrange
      req = new Request 'GET', '/api/resources?param=CUSTOM'
      middleware = new DefaultParameters '/api', {}, {}, @resources, @uriTemplateReader, new Logger

      # Act
      req.addQueryParameter 'param', 'CUSTOM'
      middleware.exec(req, {}, ()-> )

      # Assert
      req.query.param.should.eql 'CUSTOM'

  describe 'FORM PARAMETERS', =>
    it 'Should add a form parameter to the request if it is not present', () =>
      # Arrange
      req = new Request 'POST', '/api/resources'
      middleware = new DefaultParameters '/api', {}, {}, @resources, @uriTemplateReader, new Logger

      # Act
      req.addHeader 'content-type', 'application/x-www-form-urlencoded'
      middleware.exec(req, {}, ()-> )

      # Assert
      req.body.param.should.eql 'FORM PARAMETER'

    it 'Should use the assigned value', () =>
      # Arrange
      req = new Request 'POST', '/api/resources'
      middleware = new DefaultParameters '/api', {}, {}, @resources, @uriTemplateReader, new Logger

      # Act
      req.addHeader 'content-type', 'application/x-www-form-urlencoded'
      req.addBodyParameter 'param', 'CUSTOM'
      middleware.exec(req, {}, ()-> )

      # Assert
      req.body.param.should.eql 'CUSTOM'

  describe 'HEADERS', =>
    it 'Should add a header to the request if it is not present', () =>
      # Arrange
      req = new Request 'GET', '/api/resources'
      middleware = new DefaultParameters '/api', {}, {}, @resources, @uriTemplateReader, new Logger

      # Act
      middleware.exec(req, {}, ()-> )

      # Assert
      req.headers.header.should.eql 'HEADER'

    it 'Should use the assigned value', () =>
      # Arrange
      req = new Request 'GET', '/api/resources'
      middleware = new DefaultParameters '/api', {}, {}, @resources, @uriTemplateReader, new Logger

      # Act
      req.addHeader 'header', 'CUSTOM'
      middleware.exec(req, {}, ()-> )

      # Assert
      req.headers.header.should.eql 'CUSTOM'

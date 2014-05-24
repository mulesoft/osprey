parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - HEADER - TYPE - INTEGER', =>
  before () =>
    parser.loadRaml "./test/assets/validations.header.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should be correctly validated if the parameter is present', () =>
    # Arrange
    resource = @resources['/integer']
    req = new Request 'GET', '/api/integer'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', '10'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if the parameter is not present', () =>
    # Arrange
    resource = @resources['/integer']
    req = new Request 'GET', '/api/integer'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should throw an exception if the value type is incorrect', () =>
    # Arrange
    resource = @resources['/integer']
    req = new Request 'GET', '/api/integer'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', 'aa'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if the type is valid', () =>
    # Arrange
    resource = @resources['/integer']
    req = new Request 'GET', '/api/integer'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', '10'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should be correctly validated if minimum is valid', () =>
    # Arrange
    resource = @resources['/integer']
    req = new Request 'GET', '/api/integer'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', '10'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if minimum is not valid', () =>
    # Arrange
    resource = @resources['/integer']
    req = new Request 'GET', '/api/integer'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if maximum is valid', () =>
    # Arrange
    resource = @resources['/integer']
    req = new Request 'GET', '/api/integer'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', '10'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if maximum is not valid', () =>
    # Arrange
    resource = @resources['/integer']
    req = new Request 'GET', '/api/integer'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', '11'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

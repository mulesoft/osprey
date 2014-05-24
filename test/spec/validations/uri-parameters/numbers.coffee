parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - URI PARAMETER - TYPE - NUMBER', =>
  before () =>
    parser.loadRaml "./test/assets/validations.uri-parameters.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should throw an exception if the value type is incorrect', () =>
    # Arrange
    resource = @resources['/number/:id']
    req = new Request 'GET', '/api/number/aa'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if the type is valid', () =>
    # Arrange
    resource = @resources['/number/:id']
    req = new Request 'GET', '/api/number/10'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should be correctly validated if minimum is valid', () =>
    # Arrange
    resource = @resources['/number/:id']
    req = new Request 'GET', '/api/number/10'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if minimum is not valid', () =>
    # Arrange
    resource = @resources['/number/:id']
    req = new Request 'GET', '/api/number/1'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if maximum is valid', () =>
    # Arrange
    resource = @resources['/number/:id']
    req = new Request 'GET', '/api/number/10'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if maximum is not valid', () =>
    # Arrange
    resource = @resources['/number/:id']
    req = new Request 'GET', '/api/number/11'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

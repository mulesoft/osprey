parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - QUERY PARAMETER - TYPE - NUMBER', =>
  before () =>
    parser.loadRaml "./test/assets/validations.query-parameters.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should be correctly validated if the parameter is present', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '10.5'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if the parameter is not present', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should throw an exception if the value type is incorrect', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addQueryParameter 'param', 'aa'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if the type is valid', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '10'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should be correctly validated if minimum is valid', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '10'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if minimum is not valid', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if maximum is valid', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '10'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if maximum is not valid', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '12'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should throw an exception if the parameter value is empty', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number/empty'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', ''

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should throw an exception if the parameter value is infinite', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number/empty'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', Array(350).join(1)

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should throw an exception if the parameter value is not a complete number', () =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number/empty'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '10a'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

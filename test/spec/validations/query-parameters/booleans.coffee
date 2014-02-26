parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - QUERY PARAMETER - TYPE - BOOLEAN', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.query-parameters.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  it 'Should be correctly validated if the parameter is present', (done) =>
    # Arrange
    resource = @resources['/boolean']
    req = new Request 'GET', '/api/boolean?param=true'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', 'true'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter is not present', (done) =>
    # Arrange
    resource = @resources['/boolean']
    req = new Request 'GET', '/api/boolean'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should throw an exception if the value type is incorrect', (done) =>
    # Arrange
    resource = @resources['/boolean']
    req = new Request 'GET', '/api/boolean?param=aa'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addQueryParameter 'param', 'aa'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if the type is valid', (done) =>
    # Arrange
    resource = @resources['/boolean']
    req = new Request 'GET', '/api/boolean?param=true'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addQueryParameter 'param', 'true'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done() 
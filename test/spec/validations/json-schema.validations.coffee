parser = require '../../../src/wrapper'
Validation = require '../../../src/middlewares/validation'
should = require 'should'
Request = require('../../mocks/server').request
Logger = require '../../mocks/logger'
UriTemplateReader = require '../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - JSON SCHEMA', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.json-schema.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  it 'Should be correctly validated if request body is ok and content-type is application/json', (done) =>
    # Arrange
    resource = @resources['/resources']
    req = new Request 'POST', '/api/resources'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addBody { id: 'aaa' }

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should be correctly validated if request body is ok and content-type is [something]+json', (done) =>
    # Arrange
    resource = @resources['/resources']
    req = new Request 'POST', '/api/resources'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/test+json'
    req.addBody { id: 'aaa' }

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if request body is incorrect', (done) =>
    # Arrange
    resource = @resources['/resources']
    req = new Request 'POST', '/api/resources'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addBody { id: 'a' }

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should not validate if content-type is not application/json', (done) =>
    # Arrange
    resource = @resources['/resources']
    req = new Request 'POST', '/api/resources'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'text/plain'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()
parser = require '../../../src/wrapper'
Validation = require '../../../src/validation'
should = require 'should'
Request = require('../../mocks/server').request
Logger = require '../../mocks/logger'
UriTemplateReader = require '../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - XML SCHEMA', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.xml-schema.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  it 'Should be correctly validated if request body is ok', (done) =>
    # Arrange
    resource = @resources['/resources']
    req = new Request 'POST', '/api/resources'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/xml'
    req.addJsonBody '<?xml version="1.0" ?><league>test</league></xml>'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  # it 'Should throw an exception if request body is incorrect', (done) =>
  #   # Arrange
  #   resource = @resources['/resources']
  #   req = new Request 'POST', '/api/resources'
  #   validation = new Validation req, @uriTemplateReader, resource, '/api'

  #   req.addHeader 'content-type', 'application/json'
  #   req.addJsonBody { id: 'a' }

  #   # Assert
  #   ( ->
  #     validation.validate()
  #   ).should.throw();

  #   done()

  # it 'Should not validate if content-type is not application/json', (done) =>
  #   # Arrange
  #   resource = @resources['/resources']
  #   req = new Request 'POST', '/api/resources'
  #   validation = new Validation req, @uriTemplateReader, resource, '/api'

  #   req.addHeader 'content-type', 'text/plain'

  #   # Assert
  #   ( ->
  #     validation.validate()
  #   ).should.not.throw();

  #   done()
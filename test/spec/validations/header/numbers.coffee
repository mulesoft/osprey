parser = require '../../../../src/wrapper'
Validation = require '../../../../src/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - HEADER - TYPE - NUMBER', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.header.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  it 'Should be correctly validated if the parameter is present', (done) =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'Header', '10'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter is not present', (done) =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should throw an exception if the value type is incorrect', (done) =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', 'aa'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if the type is valid', (done) =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', '10'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should be correctly validated if minimum is valid', (done) =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', '10'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if minimum is not valid', (done) =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'Header', '1'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if maximum is valid', (done) =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', '10'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if maximum is not valid', (done) =>
    # Arrange
    resource = @resources['/number']
    req = new Request 'GET', '/api/number'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'Header', '11'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

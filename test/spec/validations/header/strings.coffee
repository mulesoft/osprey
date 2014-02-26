parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - HEADER - TYPE - STRING', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.header.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  it 'Should be correctly validated if the parameter is present', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', 'aaa'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter is not present', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if min-length is valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', '111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if min-length is not valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if max-length is valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addHeader 'Header', '111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if max-length is not valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', '1111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if the parameter value is present in the enum ', (done) =>
    # Arrange
    resource = @resources['/string/enum']
    req = new Request 'GET', '/api/string/enum'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', 'AAA'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter value is not present in the enum', (done) =>
    # Arrange
    resource = @resources['/string/enum']
    req = new Request 'GET', '/api/string/enum'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if pattern is matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/string/pattern']
    req = new Request 'GET', '/api/string/pattern'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', 'a'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()    

  it 'Should throw an exception if pattern is not matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/string/pattern']
    req = new Request 'GET', '/api/string/pattern'
    validation = new Validation '/api', @resources, @uriTemplateReader, new Logger

    req.addHeader 'Header', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()     
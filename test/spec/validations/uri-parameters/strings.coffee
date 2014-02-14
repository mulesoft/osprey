parser = require '../../../../src/wrapper'
Validation = require '../../../../src/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - URI PARAMETER - TYPE - STRING', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.uri-parameters.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()
 
  it 'Should be correctly validated if min-length is valid', (done) =>
    # Arrange
    resource = @resources['/string/:id']
    req = new Request 'GET', '/api/string/111'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/json'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if min-length is not valid', (done) =>
    # Arrange
    resource = @resources['/string/:id']
    req = new Request 'GET', '/api/string/1'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if max-length is valid ', (done) =>
    # Arrange
    resource = @resources['/string/:id']
    req = new Request 'GET', '/api/string/111'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/json'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if max-length is not valid', (done) =>
    # Arrange
    resource = @resources['/string/:id']
    req = new Request 'GET', '/api/string/1111'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if the parameter value is present in the enum', (done) =>
    # Arrange
    resource = @resources['/string/enum/:id']
    req = new Request 'GET', '/api/string/enum/AAA'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter value is not present in the enum', (done) =>
    # Arrange
    resource = @resources['/string/enum/:id']
    req = new Request 'GET', '/api/string/enum/1'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if pattern is matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/string/pattern/:id']
    req = new Request 'GET', '/api/string/pattern/a'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()    

  it 'Should throw an exception if pattern is not matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/string/pattern/:id']
    req = new Request 'GET', '/api/string/pattern/1'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()  


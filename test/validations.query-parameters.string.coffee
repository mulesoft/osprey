parser = require '../src/wrapper'
Validation = require '../src/validation'
should = require 'should'
Request = require('./mocks/server').request
Logger = require './mocks/logger'
UriTemplateReader = require '../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - QUERY PARAMETER - TYPE - STRING', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  it 'Should be correctly validated if the parameter is present', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'DELETE', '/api/string?param=a'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addQueryParameter 'param', 'a'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter is not present', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'DELETE', '/api/string'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if min-length is valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=111'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/json'
    req.addQueryParameter 'param', '111'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if min-length is not valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=1'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addQueryParameter 'param', '1'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if max-length is valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=111'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/json'
    req.addQueryParameter 'param', '111'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if max-length is not valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=1111'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addQueryParameter 'param', '1111'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if the parameter value is present in the enum ', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'POST', '/api/string?param=AAA'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addQueryParameter 'param', 'AAA'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter value is not present in the enum', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'POST', '/api/string?param=1'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addQueryParameter 'param', '1'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if pattern is matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'PUT', '/api/string?param=a'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addQueryParameter 'param', 'a'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()    

  it 'Should throw an exception if pattern is not matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'PUT', '/api/string?param=1'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addQueryParameter 'param', '1'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()     
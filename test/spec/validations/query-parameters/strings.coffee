parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - QUERY PARAMETER - TYPE - STRING', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.query-parameters.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  it 'Should be correctly validated if the parameter is present', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=a'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', 'aaa'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter is not present', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if min-length is valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=111'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addQueryParameter 'param', '111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if min-length is not valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=1'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if max-length is valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=111'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/json'
    req.addQueryParameter 'param', '111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if max-length is not valid', (done) =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'GET', '/api/string?param=1111'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '1111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if the parameter value is present in the enum ', (done) =>
    # Arrange
    resource = @resources['/string/enum']
    req = new Request 'integer', '/api/string/enum?param=AAA'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', 'AAA'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter value is not present in the enum', (done) =>
    # Arrange
    resource = @resources['/string/enum']
    req = new Request 'GET', '/api/string/enum?param=1'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()

  it 'Should be correctly validated if pattern is matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/string/pattern']
    req = new Request 'GET', '/api/string/pattern?param=a'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', 'a'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw();

    done()    

  it 'Should throw an exception if pattern is not matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/string/pattern']
    req = new Request 'GET', '/api/string/pattern?param=1'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addQueryParameter 'param', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw();

    done()     
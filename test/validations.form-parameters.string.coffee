parser = require '../src/wrapper'
Validation = require '../src/validation'
should = require 'should'
Request = require('./mocks/server').request
Logger = require './mocks/logger'
UriTemplateReader = require '../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - FORM PARAMETER - TYPE - STRING', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  it 'Should be correctly validated if the parameter is present', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParameters']
    req = new Request 'POST', '/api/stringWithFormParameters'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', 'aaa'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter is not present', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParameters']
    req = new Request 'POST', '/api/stringWithFormParameters'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if min-length is valid', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParameters']
    req = new Request 'POST', '/api/stringWithFormParameters'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '111'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if min-length is not valid', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParameters']
    req = new Request 'POST', '/api/stringWithFormParameters'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '1'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if max-length is valid', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParameters']
    req = new Request 'POST', '/api/stringWithFormParameters'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '111'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if max-length is not valid', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParameters']
    req = new Request 'POST', '/api/stringWithFormParameters'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '1111'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if the parameter value is present in the enum ', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParametersEnum']
    req = new Request 'POST', '/api/stringWithFormParametersEnum'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', 'AAA'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()

  it 'Should throw an exception if the parameter value is not present in the enum', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParametersEnum']
    req = new Request 'POST', '/api/stringWithFormParametersEnum'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '1'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()

  it 'Should be correctly validated if pattern is matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParametersPattern']
    req = new Request 'POST', '/api/stringWithFormParametersPattern'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', 'a'

    # Assert
    ( ->
      validation.validate()
    ).should.not.throw();

    done()    

  it 'Should throw an exception if pattern is not matched by the parameter value', (done) =>
    # Arrange
    resource = @resources['/stringWithFormParametersPattern']
    req = new Request 'POST', '/api/stringWithFormParametersPattern'
    validation = new Validation req, @uriTemplateReader, resource, '/api'

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '1'

    # Assert
    ( ->
      validation.validate()
    ).should.throw();

    done()     
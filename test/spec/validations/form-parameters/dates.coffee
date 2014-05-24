parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - FORM PARAMETER - TYPE - DATE', =>
  before () =>
    parser.loadRaml './test/assets/validations.form-parameters.raml', new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should be correctly validated if the parameter is present', () =>
    # Arrange
    resource = @resources['/date']
    req = new Request 'POST', '/api/date'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', 'Sun, 06 Nov 1994 08:49:37 GMT'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if the parameter is not present', () =>
    # Arrange
    resource = @resources['/date']
    req = new Request 'POST', '/api/date'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should throw an exception if the value type is incorrect', () =>
    # Arrange
    resource = @resources['/date']
    req = new Request 'POST', '/api/date'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', ''

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if the type is valid', () =>
    # Arrange
    resource = @resources['/date']
    req = new Request 'POST', '/api/date'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', 'Sun, 06 Nov 1994 08:49:37 GMT'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - FORM PARAMETER - TYPE - STRING', =>
  before () =>
    parser.loadRaml './test/assets/validations.form-parameters.raml', new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should be correctly validated if the parameter is present', () =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'POST', '/api/string'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', 'aaa'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if the parameter is not present', () =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'POST', '/api/string'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if min-length is valid', () =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'POST', '/api/string'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if min-length is not valid', () =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'POST', '/api/string'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if max-length is valid', () =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'POST', '/api/string'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if max-length is not valid', () =>
    # Arrange
    resource = @resources['/string']
    req = new Request 'POST', '/api/string'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '1111'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if the parameter value is present in the enum ', () =>
    # Arrange
    resource = @resources['/string/enum']
    req = new Request 'POST', '/api/string/enum'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', 'AAA'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if the parameter value is not present in the enum', () =>
    # Arrange
    resource = @resources['/string/enum']
    req = new Request 'POST', '/api/string/enum'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if no parameter value is present', () =>
    # Arrange
    resource = @resources['/string/enum']
    req = new Request 'POST', '/api/string/enum'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'

    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should be correctly validated if pattern is matched by the parameter value', () =>
    # Arrange
    resource = @resources['/string/pattern']
    req = new Request 'POST', '/api/string/pattern'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', 'a'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

  it 'Should throw an exception if pattern is not matched by the parameter value', () =>
    # Arrange
    resource = @resources['/string/pattern']
    req = new Request 'POST', '/api/string/pattern'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'
    req.addBodyParameter 'param', '1'

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if no parameter value is present', () =>
    # Arrange
    resource = @resources['/string/pattern']
    req = new Request 'POST', '/api/string/pattern'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    req.addHeader 'content-type', 'application/x-www-form-urlencoded'

    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

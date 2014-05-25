parser = require '../../../../src/wrapper'
Validation = require '../../../../src/middlewares/validation'
should = require 'should'
Request = require('../../../mocks/server').request
Logger = require '../../../mocks/logger'
UriTemplateReader = require '../../../../src/uri-template-reader'

describe 'OSPREY VALIDATIONS - NESTED PARAMETERS', =>
  before () =>
    parser.loadRaml "./test/assets/validations.uri-parameters.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should throw an exception when the first parameter is invalid', () =>
    # Arrange
    resource = @resources['/nested/:first']
    req = new Request 'GET', '/api/nested/abc'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should throw an exception when the first parameter is invalid in a nested structure', () =>
    # Arrange
    resource = @resources['/nested/:first/:second']
    req = new Request 'GET', '/api/nested/abc/10'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should throw an exception when the last parameter is invalid in a nested structure', () =>
    # Arrange
    resource = @resources['/nested/:first/:second']
    req = new Request 'GET', '/api/nested/abcde/abc'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.throw()

  it 'Should be correctly validated if both parameters are valid', () =>
    # Arrange
    resource = @resources['/nested/:first/:second']
    req = new Request 'GET', '/api/nested/abcde/15'
    validation = new Validation '/api', {}, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      validation.validateRequest resource, req
    ).should.not.throw()

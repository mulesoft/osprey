parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/middlewares/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Response = require('../../mocks/server').response
Request = require('../../mocks/server').request
Middleware = require('../../mocks/server').middleware
Logger = require '../../mocks/logger'

describe 'OSPREY ROUTER - OVERWRITE', =>
  before () =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should be able to overwrite a valid resource', () =>
    # Arrange
    context = new Express
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMethod method: 'get', template: '/resource', handler: () ->

    # Assert
    context.getMethods[0].should.be.eql '/api/resource'

  it 'Should not be able to overwrite a resource which does not exists in the RAML file', () =>
    # Arrange
    context = new Express
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMethod method: 'get', template: '/no-existing', handler: null

    # Assert
    context.getMethods.length.should.be.eql 0

  it 'Should not fail if a resource does not have method defined', () =>
    # Arrange
    context = new Express
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMethod method: 'get', template: '/resource2', handler: null

    # Assert
    context.getMethods.length.should.be.eql 0

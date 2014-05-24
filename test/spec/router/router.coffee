parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/middlewares/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Response = require('../../mocks/server').response
Request = require('../../mocks/server').request
Middleware = require('../../mocks/server').middleware
Logger = require '../../mocks/logger'

describe 'OSPREY ROUTER', =>
  before () =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should return false if the resource was not registered on express', () =>
    # Arrange
    context = new Express
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    result = router.routerExists 'GET', '/resource'

    # Assert
    result.should.be.eql false

  it 'Should return true if the resource already exists in express', () =>
    # Arrange
    context = new Express

    context.routes =
      GET: [
        regexp: /^\/resource\/?$/i
      ]

    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    result = router.routerExists 'GET', '/resource'

    # Assert
    result.should.be.eql true

  it 'Should be able to resolve a resource with uri parameters', () =>
    # Arrange
    context = new Express

    context.routes =
      GET: [
        regexp:  /^\/resource\/(?:([^\/]+?))\/?$/i
      ]

    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    result = router.routerExists 'GET', '/resource/1'

    # Assert
    result.should.be.eql true


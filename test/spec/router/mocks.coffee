parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/middlewares/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Response = require('../../mocks/server').response
Request = require('../../mocks/server').request
Middleware = require('../../mocks/server').middleware
Logger = require '../../mocks/logger'

describe 'OSPREY ROUTER - MOCKS', =>
  before () =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should response 200 if the resource does not have an example', () =>
    # Arrange
    context = new Express
    res = new Response
    req = new Request 'GET', '/resource'
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.status.should.be.eql 200

  it 'Should response with the example defined in the RAML file', () =>
    # Arrange
    context = new Express
    res = new Response
    req = new Request 'GET', '/resource/1'
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.response.should.be.eql '[{\n  "id": "example"\n}]\n'
    res.key.should.be.eql 'Content-Type'
    res.value.should.be.eql 'application/json'

  it 'Shoul skip not registered resources if mock routing was turned off', () =>
    # Arrange
    context = new Express
    res = new Response
    req = new Request 'GET', '/resource'
    middleware = new Middleware(0)
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMock req, res, middleware.next, false

    # Assert
    middleware.nextCounter.should.be.eql 1

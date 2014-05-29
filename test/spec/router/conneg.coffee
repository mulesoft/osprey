parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/middlewares/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Response = require('../../mocks/server').response
Request = require('../../mocks/server').request
Middleware = require('../../mocks/server').middleware
Logger = require '../../mocks/logger'

describe 'OSPREY ROUTER - CONTENT NEGOTIATION', =>
  before () =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should response with the correct mime type if the accept type is supported', () =>
    # Arrange
    context = new Express
    res = new Response
    req = new Request 'GET', '/resource/1', 'application/xml'
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.key.should.be.eql 'Content-Type'
    res.value.should.be.eql 'application/xml'

  it 'Should response with the first defined mime type if the accept type is */*', () =>
    # Arrange
    context = new Express
    res = new Response
    req = new Request 'GET', '/resource/1'
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.key.should.be.eql 'Content-Type'
    res.value.should.be.eql 'application/json'

  it 'Should throw an exception if the accept type is not supported', () =>
    # Arrange
    context = new Express
    res = new Response
    req = new Request 'GET', '/resource/1', 'text/plain'
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      router.resolveMock req, res, null, true
    ).should.throw()

  it 'Should response 200 if the content type is supported', () =>
    # Arrange
    context = new Express
    res = new Response
    req = new Request 'POST', '/resource', 'application/json', 'application/json'
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.status.should.be.eql 200

  it 'Should throw an exception if the content type is not supported', () =>
    # Arrange
    context = new Express
    res = new Response
    req = new Request 'POST', '/resource', 'text/plain'
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, new Logger

    # Assert
    ( ->
      router.resolveMock req, res, null, true
    ).should.throw()

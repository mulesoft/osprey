parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Response = require('../../mocks/server').response
Request = require('../../mocks/server').request
Middleware = require('../../mocks/server').middleware
Logger = require '../../mocks/logger'

describe 'OSPREY ROUTER - CONTENT NEGOTIATION', =>
  before (done) =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      done()

  it 'Should response with the correct mime type if the accept type is supported', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    res = new Response
    req = new Request 'GET', '/api/resource/1', 'application/xml'
    router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.key.should.be.eql 'Content-Type'
    res.value.should.be.eql 'application/xml'

    done() 

  it 'Should response with the first defined mime type if the accept type is */*', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    res = new Response
    req = new Request 'GET', '/api/resource/1'
    router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.key.should.be.eql 'Content-Type'
    res.value.should.be.eql 'application/json'

    done() 

  it 'Should throw an exception if the accept type is not supported', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    res = new Response
    req = new Request 'GET', '/api/resource/1', 'text/plain'
    router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

    # Assert
    ( ->
      router.resolveMock req, res, null, true
    ).should.throw();

    done() 

  it 'Should response 200 if the content type is supported', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    res = new Response
    req = new Request 'POST', '/api/resource', 'application/json', 'application/json'
    router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.status.should.be.eql 200

    done() 

  it 'Should throw an exception if the content type is not supported', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    res = new Response
    req = new Request 'POST', '/api/resource', 'text/plain'
    router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

    # Assert
    ( ->
      router.resolveMock req, res, null, true
    ).should.throw();

    done() 
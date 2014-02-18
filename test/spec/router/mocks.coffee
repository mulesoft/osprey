parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Response = require('../../mocks/server').response
Request = require('../../mocks/server').request
Middleware = require('../../mocks/server').middleware
Logger = require '../../mocks/logger'

describe 'OSPREY ROUTER - MOCKS', =>
  before (done) =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      done()

  it 'Should response 200 if the resource does not have an example', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    res = new Response
    req = new Request 'GET', '/api/resource'
    router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.status.should.be.eql 200

    done() 

  it 'Should response with the example defined in the RAML file', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    res = new Response
    req = new Request 'GET', '/api/resource/1'
    router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

    # Act
    router.resolveMock req, res, null, true

    # Assert
    res.response.should.be.eql '[{\n  "id": "example"\n}]\n'
    res.key.should.be.eql 'Content-Type'
    res.value.should.be.eql 'application/json'

    done() 

  it 'Shoul skip not registered resources if mock routing was turned off', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    res = new Response
    req = new Request 'GET', '/api/resource'
    middleware = new Middleware(0)
    router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

    # Act
    router.resolveMock req, res, middleware.next, false

    # Assert
    middleware.nextCounter.should.be.eql 1

    done() 
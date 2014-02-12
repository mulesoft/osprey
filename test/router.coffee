parser = require '../src/wrapper'
OspreyRouter = require '../src/router'
UriTemplateReader = require '../src/uri-template-reader'
should = require 'should'
Express = require('./mocks/server').express
Response = require('./mocks/server').response
Request = require('./mocks/server').request
Middleware = require('./mocks/server').middleware
Logger = require './mocks/logger'

describe 'OSPREY ROUTER', =>
  before (done) =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      done()

  describe 'ROUTER EXISTENCE IN EXPRESS', ->    
    it 'Should return false if the resource was not registered on express', (done) =>        
      # Arrange
      context = new Express
      router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, new Logger

      # Act
      result = router.routerExists 'GET', '/resource'

      # Assert
      result.should.be.eql false

      done()

    it 'Should return true if the resource already exists in express', (done) =>        
      # Arrange
      context = new Express

      context.routes = 
        GET: [
          regexp: /^\/resource\/?$/i
        ]

      router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, new Logger

      # Act
      result = router.routerExists 'GET', '/resource'

      # Assert
      result.should.be.eql true

      done()

    it 'Should be able to resolve a resource with uri parameters', (done) =>        
      # Arrange
      context = new Express

      context.routes = 
        GET: [
          regexp:  /^\/resource\/(?:([^\/]+?))\/?$/i
        ]

      router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, new Logger

      # Act
      result = router.routerExists 'GET', '/resource/1'

      # Assert
      result.should.be.eql true

      done()

  describe 'ROUTER OVERWRITE', =>    
    it 'Should be able to overwrite a valid resource', (done) =>        
      # Arrange
      context = new Express
      router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, new Logger

      # Act
      router.resolveMethod method: 'get', template: '/resource', handler: null

      # Assert
      context.getMethods[0].should.be.eql '/api/resource'

      done()

    it 'Should not be able to overwrite a resource which does not exists in the RAML file', (done) =>        
      # Arrange
      context = new Express
      router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, new Logger

      # Act
      router.resolveMethod method: 'get', template: '/no-existing', handler: null

      # Assert
      context.getMethods.length.should.be.eql 0

      done() 

    it 'Should not fail if a resource does not have method defined', (done) =>        
      # Arrange
      context = new Express
      router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, new Logger

      # Act
      router.resolveMethod method: 'get', template: '/resource2', handler: null

      # Assert
      context.getMethods.length.should.be.eql 0

      done()   

  describe 'MOCK ROUTER', =>  
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
      res.response.should.be.eql 200

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

  describe 'LOGGING', =>  
    it 'Should make a log entry informing which resource was overwritten', (done) =>  
      # Arrange
      context = new Express
      logger = new Logger
      router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

      # Act
      router.resolveMethod method: 'get', template: '/resource', handler: null

      # Assert
      logger.debugMessages[0].should.eql  'Overwritten resource - GET /resource'

      done()

    it 'Should make a log entry informing that a resource cannot be overwrite because it does not exists', (done) =>  
      # Arrange
      context = new Express
      logger = new Logger
      router = new OspreyRouter '/api', context, @resources, @uriTemplateReader, logger

      # Act
      router.resolveMethod method: 'get', template: '/no-existing', handler: null

      # Assert
      logger.errorMessages[0].should.eql  'Resource to overwrite does not exists - GET /no-existing'

      done()
Osprey = require '../src/osprey'
parser = require '../src/wrapper'
OspreyRouter = require '../src/router'
UriTemplateReader = require '../src/uri-template-reader'
should = require 'should'
Express = require './mocks/express'
Logger = require './mocks/logger'

describe 'OSPREY', ->
  before (done) ->
    parser.loadRaml "./test/assets/api.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      
      @router = new OspreyRouter '/api', @context, @resources, @uriTemplateReader
      done()

  describe 'SETTINGS', ->    
    it 'Should register by default validations, routing and exception handling', (done) =>        
      # Arrange
      context = new Express
      osprey = new Osprey '/api', context, {}, new Logger

      # Act
      osprey.register @router, @uriTemplateReader, @resources

      # Assert
      context.middlewares.should.have.lengthOf 3

      done()

    it 'Should possible to disable validations', (done) =>        
      # Arrange
      context = new Express
      osprey = new Osprey '/api', context, {
        enableValidations: false
      }, new Logger

      # Act
      osprey.register @router, @uriTemplateReader, @resources

      # Assert
      context.middlewares.should.have.lengthOf 2

      done()

    it 'Should enable the api console by default', (done) =>        
      # Arrange
      context = new Express
      osprey = new Osprey '/api', context, null, new Logger

      # Act
      osprey.registerConsole()

      # Assert
      context.middlewares.should.have.lengthOf 1
      context.getMethods.should.have.lengthOf 1
      context.getMethods[0].should.eql '/api'
      context.middlewares[0].should.eql '/api/console'

      done()

    it 'Should use default settings if settings are null', (done) =>        
      # Arrange
      context = new Express
      osprey = new Osprey '/api', context, null, new Logger

      # Act
      osprey.register @router, @uriTemplateReader, @resources

      # Assert
      context.middlewares.should.have.lengthOf 3

      done()

    it 'Should use default settings if settings are undefined', (done) =>        
      # Arrange
      context = new Express
      osprey = new Osprey '/api', context, undefined, new Logger

      # Act
      osprey.register @router, @uriTemplateReader, @resources

      # Assert
      context.middlewares.should.have.lengthOf 3

      done()

  describe 'LOGGING', ->    
    it 'Should make a log entry informing which modules were initialized', (done) =>        
      # Arrange
      logger = new Logger
      osprey = new Osprey '/api', new Express, {}, logger

      # Act
      osprey.register @router, @uriTemplateReader, @resources
      osprey.registerConsole()

      # Assert
      logger.infoMessages.should.have.lengthOf 4
      logger.infoMessages[0].should.eql 'Osprey::Validations has been initialized successfully'
      logger.infoMessages[1].should.eql 'Osprey::ExceptionHandler has been initialized successfully'
      logger.infoMessages[2].should.eql 'Osprey::Router has been initialized successfully'
      logger.infoMessages[3].should.eql 'Osprey::APIConsole has been initialized successfully'

      done()
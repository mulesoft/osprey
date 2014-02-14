Osprey = require '../../../src/osprey'
parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Logger = require '../../mocks/logger'

describe 'OSPREY - LOGGING', =>
  before (done) =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      
      @router = new OspreyRouter '/api', new Express, @resources, @uriTemplateReader, new Logger
      done()
  
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
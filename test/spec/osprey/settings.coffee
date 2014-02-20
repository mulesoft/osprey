Osprey = require '../../../src/osprey'
parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Logger = require '../../mocks/logger'

describe 'OSPREY - SETTINGS', =>
  before (done) =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      
      @router = new OspreyRouter '/api', new Express, @resources, @uriTemplateReader, new Logger
      done()
   
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
Osprey = require '../../../src/osprey'
parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/middlewares/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Logger = require '../../mocks/logger'

describe 'OSPREY - SETTINGS', =>
  before () =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should register by default validations, routing and exception handling', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    # Act
    osprey.register @uriTemplateReader, @resources

    # Assert
    context.middlewares.should.have.lengthOf 4

  it 'Should possible to disable validations', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {
      enableValidations: false
    }, new Logger

    # Act
    osprey.register @uriTemplateReader, @resources

    # Assert
    context.middlewares.should.have.lengthOf 3

  it 'Should enable the api console by default', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, null, new Logger

    # Act
    osprey.registerConsole()

    # Assert
    context.middlewares.should.have.lengthOf 2
    context.getMethods.should.have.lengthOf 3
    context.getMethods[0].should.eql '/api/console'
    context.middlewares[0].should.eql '/api/console'

  it 'Should use default settings if settings are null', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, null, new Logger

    # Act
    osprey.register @uriTemplateReader, @resources

    # Assert
    context.middlewares.should.have.lengthOf 4

  it 'Should use default settings if settings are undefined', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, undefined, new Logger

    # Act
    osprey.register @uriTemplateReader, @resources

    # Assert
    context.middlewares.should.have.lengthOf 4

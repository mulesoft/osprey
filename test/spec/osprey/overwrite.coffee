Osprey = require '../../../src/osprey'
parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/middlewares/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Logger = require '../../mocks/logger'

describe 'OSPREY - OVERWRITE', =>
  before () =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates

  it 'Should be able to overwrite an existing resource - GET', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.get '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

      # Act
      osprey.register uriTemplateReader, wrapper.getResources()

      # Assert
      context.getMethods.should.have.lengthOf 1
      context.getMethods[0].should.eql '/api/resource'

  it 'Should be able to overwrite an existing resource - POST', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.post '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

      # Act
      osprey.register uriTemplateReader, wrapper.getResources()

      # Assert
      context.postMethods.should.have.lengthOf 1
      context.postMethods[0].should.eql '/api/resource'

  it 'Should be able to overwrite an existing resource - PUT', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.put '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

      # Act
      osprey.register uriTemplateReader, wrapper.getResources()

      # Assert
      context.putMethods.should.have.lengthOf 1
      context.putMethods[0].should.eql '/api/resource'

  it 'Should be able to overwrite an existing resource - DELETE', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.delete '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

      # Act
      osprey.register uriTemplateReader, wrapper.getResources()

      # Assert
      context.deleteMethods.should.have.lengthOf 1
      context.deleteMethods[0].should.eql '/api/resource'

  it 'Should be able to overwrite an existing resource - HEAD', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.head '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

      # Act
      osprey.register uriTemplateReader, wrapper.getResources()

      # Assert
      context.headMethods.should.have.lengthOf 1
      context.headMethods[0].should.eql '/api/resource'

  it 'Should be able to overwrite an existing resource - PATCH', () =>
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.patch '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()

      # Act
      osprey.register uriTemplateReader, wrapper.getResources()

      # Assert
      context.patchMethods.should.have.lengthOf 1
      context.patchMethods[0].should.eql '/api/resource'

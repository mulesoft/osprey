Osprey = require '../src/osprey'
parser = require '../src/wrapper'
OspreyRouter = require '../src/router'
UriTemplateReader = require '../src/uri-template-reader'
should = require 'should'
Express = require('./mocks/server').express
Logger = require './mocks/logger'

describe 'OSPREY - OVERWRITE', =>
  before (done) =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      
      @router = new OspreyRouter '/api', new Express, @resources, @uriTemplateReader, new Logger
      done()
 
  it 'Should be able to overwrite an existing resource - GET', (done) =>        
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.get '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()
      router = new OspreyRouter '/api', context, wrapper.getResources(), uriTemplateReader, new Logger

      # Act
      osprey.route router, false
      
      # Assert
      context.getMethods.should.have.lengthOf 1
      context.getMethods[0].should.eql '/api/resource'

      done()

  it 'Should be able to overwrite an existing resource - POST', (done) =>        
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.post '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()
      router = new OspreyRouter '/api', context, wrapper.getResources(), uriTemplateReader, new Logger

      # Act
      osprey.route router, false
      
      # Assert
      context.postMethods.should.have.lengthOf 1
      context.postMethods[0].should.eql '/api/resource'

      done()

  it 'Should be able to overwrite an existing resource - PUT', (done) =>        
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.put '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()
      router = new OspreyRouter '/api', context, wrapper.getResources(), uriTemplateReader, new Logger

      # Act
      osprey.route router, false
      
      # Assert
      context.putMethods.should.have.lengthOf 1
      context.putMethods[0].should.eql '/api/resource'

      done()

  it 'Should be able to overwrite an existing resource - DELETE', (done) =>        
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.delete '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()
      router = new OspreyRouter '/api', context, wrapper.getResources(), uriTemplateReader, new Logger

      # Act
      osprey.route router, false
      
      # Assert
      context.deleteMethods.should.have.lengthOf 1
      context.deleteMethods[0].should.eql '/api/resource'

      done()

  it 'Should be able to overwrite an existing resource - HEAD', (done) =>        
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.head '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()
      router = new OspreyRouter '/api', context, wrapper.getResources(), uriTemplateReader, new Logger

      # Act
      osprey.route router, false
      
      # Assert
      context.headMethods.should.have.lengthOf 1
      context.headMethods[0].should.eql '/api/resource'

      done()

  it 'Should be able to overwrite an existing resource - PATCH', (done) =>        
    # Arrange
    context = new Express
    osprey = new Osprey '/api', context, {}, new Logger

    osprey.patch '/resource', (req, res) ->

    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      uriTemplateReader = new UriTemplateReader wrapper.getUriTemplates()
      router = new OspreyRouter '/api', context, wrapper.getResources(), uriTemplateReader, new Logger

      # Act
      osprey.route router, false
      
      # Assert
      context.patchMethods.should.have.lengthOf 1
      context.patchMethods[0].should.eql '/api/resource'

      done()
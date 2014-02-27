parser = require '../../../src/wrapper'
OspreyRouter = require '../../../src/middlewares/router'
UriTemplateReader = require '../../../src/uri-template-reader'
should = require 'should'
Express = require('../../mocks/server').express
Response = require('../../mocks/server').response
Request = require('../../mocks/server').request
Middleware = require('../../mocks/server').middleware
Logger = require '../../mocks/logger'

describe 'OSPREY ROUTER - LOGGING', =>
  before (done) =>
    parser.loadRaml "./test/assets/well-formed.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
      done()

  it 'Should make a log entry informing which resource was overwritten', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, logger

    # Act
    router.resolveMethod method: 'get', template: '/resource', handler: () ->

    # Assert
    logger.debugMessages[0].should.eql  'Overwritten resource - GET /resource'

    done()

  it 'Should make a log entry informing that a resource cannot be overwrite because it does not exists', (done) =>  
    # Arrange
    context = new Express
    logger = new Logger
    router = new OspreyRouter '/api', context, {}, @resources, @uriTemplateReader, logger

    # Act
    router.resolveMethod method: 'get', template: '/no-existing', handler: () ->

    # Assert
    logger.errorMessages[0].should.eql  'Resource to overwrite does not exists - GET /no-existing'

    done()
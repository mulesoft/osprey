parser = require '../src/wrapper'
should = require 'should'
Logger = require './mocks/logger'

describe 'WRAPPER', ->
  before (done) ->
    parser.loadRaml './test/assets/api.raml', new Logger, (wrapper) =>
      @parsedRaml = wrapper
      done()

  describe 'RAML WRAPPER DATA ELEMENT', ->
    it 'Should contain at least base properties: title,version,baseUri', (done)->
      # Act
      raml = @parsedRaml.getRaml()

      # Assert
      raml.should.have.property 'title', 'La Liga'
      raml.should.have.property 'version', '1.0'
      raml.should.have.property 'baseUri', 'http://localhost:3000/api'

      done()
    it 'Should contain 3 parent resources and 1st resources shoud have 2 methods', (done)->
      # Act
      raml = @parsedRaml.getRaml()

      # Assert
      raml.should.have.property('resources').with.a.lengthOf(3)
      raml.resources[0].should.have.property('methods').with.a.lengthOf(2)

      done()

  describe 'RESOURCES MAP', ->
    it 'Should have 5 resources', (done) ->
      # Act
      resources = @parsedRaml.getResources()

      # Assert
      resources.should.be.an.instanceOf Object
      resources.should.have.properties '/teams', '/teams/:teamId', '/positions',
        '/fixture', '/fixture/:homeTeamId/:awayTeamId'

      done()

  describe 'RESOURCES LIST', ->
    it 'Should have 5 resources', (done) ->
      # Act
      resources = @parsedRaml.getResourcesList()

      # Assert
      resources.should.be.an.instanceOf Object
      resources[0].should.have.property 'uri', '/teams/:teamId'
      resources[1].should.have.property 'uri', '/teams'
      resources[2].should.have.property 'uri', '/positions'
      resources[3].should.have.property 'uri', '/fixture/:homeTeamId/:awayTeamId'
      resources[4].should.have.property 'uri', '/fixture'

      done()

  describe 'SECURITY SCHEMES', ->
    it 'Should have the correct structure of Oauth', (done)->
      # Act
      schemes = @parsedRaml.getSecuritySchemes()

      # Assert
      schemes[0].should.have.property "oauth_2_0"
      schemes[0]["oauth_2_0"].settings.should.have.property "authorizationUri", "https://www.dropbox.com/1/oauth2/authorize"
      schemes[0]["oauth_2_0"].settings.should.have.property "accessTokenUri", "https://api.dropbox.com/1/oauth2/token"
      schemes[0]["oauth_2_0"].settings.authorizationGrants.should.have.length 2
      schemes[0]["oauth_2_0"].settings.authorizationGrants.should.include "code"
      schemes[0]["oauth_2_0"].settings.authorizationGrants.should.include "token"

      done()

  describe 'PROTOCOLS', ->
    it 'Should return an array with HTTP, HTTPS protocols', (done)->
      # Act
      protocols = @parsedRaml.getProtocols()

      # Assert
      protocols.should.have.length 2
      protocols.should.include 'HTTPS'
      protocols.should.include 'HTTP'

      done()

  describe 'LOGGING', ->    
    it 'Should make a log entry informing that the RAML file was successfully loaded', (done) =>        
      # Arrange
      logger = new Logger

      # Act
      parser.load(useCache = false) './test/assets/well-formed.raml', logger, (wrapper) ->
        # Assert
        logger.infoMessages.should.have.lengthOf 1
        logger.infoMessages[0].should.eql 'RAML successfully loaded'

        done()

    it 'Should make a log entry informing that the RAML file has an error', (done) =>        
      # Arrange
      logger = new Logger

      # Act
      parser.load(useCache = false) './test/assets/not-well-formed.raml', logger, null, (error) ->
        # Assert
        logger.errorMessages.should.have.lengthOf 1
        logger.errorMessages[0].should.contain 'Error when parsing RAML'
        logger.errorMessages[0].should.contain 'Message:'
        logger.errorMessages[0].should.contain 'Column:'
        logger.errorMessages[0].should.contain 'Line:'

        done()
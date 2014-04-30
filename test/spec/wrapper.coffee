parser = require '../../src/wrapper'
should = require 'should'
Logger = require '../mocks/logger'

describe 'WRAPPER', ->
  before (done) ->
    parser.loadRaml './test/assets/well-formed.raml', new Logger, (wrapper) =>
      @parsedRaml = wrapper
      done()

  it 'Should contain at least base properties: title,version,baseUri', (done)->
    # Act
    raml = @parsedRaml.getRaml()

    # Assert
    raml.should.have.property 'title', 'well-formed-example'
    raml.should.have.property 'version', '1.0'
    raml.should.have.property 'baseUri', 'http://localhost:3000/api'

    done()

  it 'Should read resources as a map', (done) ->
    # Act
    resources = @parsedRaml.getResources()

    # Assert
    resources.should.be.an.instanceOf Object
    resources.should.have.properties '/resource'

    done()

  it 'Should read resources as a list', (done) ->
    # Act
    resources = @parsedRaml.getResourcesList()

    # Assert
    resources.should.be.an.instanceOf Object
    resources[0].should.have.property 'uri', '/resource/:resourceId'
    resources[1].should.have.property 'uri', '/resource'

    done()

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

  it 'Should return an array with HTTP, HTTPS protocols', (done)->
    # Act
    protocols = @parsedRaml.getProtocols()

    # Assert
    protocols.should.have.length 2
    protocols.should.include 'HTTPS'
    protocols.should.include 'HTTP'

    done()
parser = require '../../src/wrapper'
UriTemplateReader = require '../../src/uri-template-reader'
should = require 'should'
Logger = require '../mocks/logger'

describe 'URI TEMPLATE READER', ->
  before (done) ->
    parser.loadRaml './test/assets/well-formed.raml', new Logger, (wrapper) =>
      @uriTemplates = wrapper.getUriTemplates()
      done()

  it 'Should correctly generate uri matchers', (done) ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.generateUriMatchers @uriTemplates

    # Assert
    result.should.not.eql null
    result.should.have.lengthOf 3

    done()

  it 'Should correctly read an uri template', (done) ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getTemplateFor '/resource/1'
    
    # Assert
    result.should.not.eql null
    result.should.have.property 'uriTemplate', '/resource/:resourceId'
    result.should.have.property 'regexp'

    done()

  it 'Should read a null value if uri template does not exists', (done) ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getTemplateFor '/'

    # Assert
    should(result).eql null

    done()

  it 'Should read a null value if uri template is empty', (done) ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getTemplateFor ''

    # Assert
    should(result).eql null

    done()

  it 'Should correctly read uri parameters for a given uri', (done) ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor '/resource/1'

    # Assert
    result.should.not.eql null
    result.should.have.property 'resourceId', '1'

    done()

  it 'Should read a null value if uri does not have parameters', (done) ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor '/resource'

    # Assert
    should(result).eql null

    done()

  it 'Should read a null value if uri does not exists', (done) ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor '/'

    # Assert
    should(result).eql null

    done()

  it 'Should read a null value if uri is empty', (done) ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor ''

    # Assert
    should(result).eql null

    done()

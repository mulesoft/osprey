parser = require '../../src/wrapper'
UriTemplateReader = require '../../src/uri-template-reader'
should = require 'should'
Logger = require '../mocks/logger'

describe 'URI TEMPLATE READER', ->
  before () ->
    parser.loadRaml './test/assets/well-formed.raml', new Logger, (wrapper) =>
      @uriTemplates = wrapper.getUriTemplates()

  it 'Should correctly generate uri matchers', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.generateUriMatchers @uriTemplates

    # Assert
    result.should.not.eql null
    result.should.have.lengthOf 3

  it 'Should correctly read an uri template', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getTemplateFor '/resource/1'

    # Assert
    result.should.not.eql null
    result.should.have.property 'uriTemplate', '/resource/:resourceId'
    result.should.have.property 'regexp'

  it 'Should read a null value if uri template does not exists', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getTemplateFor '/'

    # Assert
    should(result).eql null

  it 'Should read a null value if uri template is empty', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getTemplateFor ''

    # Assert
    should(result).eql null

  it 'Should correctly read uri parameters for a given uri', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor '/resource/1'

    # Assert
    result.should.not.eql null
    result.should.have.property 'resourceId', '1'

  it 'Should correctly read uri parameters for a given uri if it has query parameters', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor '/resource/1?someParam=somevalue'

    # Assert
    result.should.not.eql null
    result.should.have.property 'resourceId', '1'

  it 'Should read a null value if uri does not have parameters', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor '/resource'

    # Assert
    should(result).eql null

  it 'Should read a null value if uri does not exists', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor '/'

    # Assert
    should(result).eql null

  it 'Should read a null value if uri is empty', () ->
    # Arrange
    uriTemplateReader = new UriTemplateReader @uriTemplates

    # Act
    result = uriTemplateReader.getUriParametersFor ''

    # Assert
    should(result).eql null

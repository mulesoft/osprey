parser = require '../src/wrapper'
Validation = require '../src/validation'
should = require 'should'
Request = require('./mocks/server').request
Logger = require './mocks/logger'
UriTemplateReader = require '../src/uri-template-reader'

describe 'OSPREY VALIDATIONS', =>
  before (done) =>
    parser.loadRaml "./test/assets/validations.raml", new Logger, (wrapper) =>
      @resources = wrapper.getResources()
      templates = wrapper.getUriTemplates()
      @uriTemplateReader = new UriTemplateReader templates
  
      done()

  describe 'URI PARAMETER VALIDATIONS', =>    
    it 'Should be correctly validated if min-length is valid - STRING', (done) =>
      # Arrange
      resource = @resources['/string/:id']
      req = new Request 'GET', '/api/string/111'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if min-length is not valid - STRING', (done) =>
      # Arrange
      resource = @resources['/string/:id']
      req = new Request 'GET', '/api/string/1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if max-length is valid - STRING', (done) =>
      # Arrange
      resource = @resources['/string/:id']
      req = new Request 'GET', '/api/string/111'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if max-length is not valid - STRING', (done) =>
      # Arrange
      resource = @resources['/string/:id']
      req = new Request 'GET', '/api/string/1111'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if the parameter value is present in the enum - STRING', (done) =>
      # Arrange
      resource = @resources['/stringWithEnum/:id']
      req = new Request 'GET', '/api/stringWithEnum/AAA'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if the parameter value is not present in the enum - STRING', (done) =>
      # Arrange
      resource = @resources['/stringWithEnum/:id']
      req = new Request 'GET', '/api/stringWithEnum/1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if pattern is matched by the parameter value - STRING', (done) =>
      # Arrange
      resource = @resources['/stringWithPattern/:id']
      req = new Request 'GET', '/api/stringWithPattern/a'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()    

    it 'Should throw an exception if pattern is not matched by the parameter value - STRING', (done) =>
      # Arrange
      resource = @resources['/stringWithPattern/:id']
      req = new Request 'GET', '/api/stringWithPattern/1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()  

    it 'Should throw an exception if the value type is incorrect - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integerType/:id']
      req = new Request 'GET', '/api/integerType/aa'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if the type is valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integerType/:id']
      req = new Request 'GET', '/api/integerType/1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should be correctly validated if minimum is valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integer/:id']
      req = new Request 'GET', '/api/integer/10'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if minimum is not valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integer/:id']
      req = new Request 'GET', '/api/integer/1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if maximum is valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integer/:id']
      req = new Request 'GET', '/api/integer/10'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if maximum is not valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integer/:id']
      req = new Request 'GET', '/api/integer/11'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should throw an exception if the value type is incorrect - NUMBER', (done) =>
      # Arrange
      resource = @resources['/numberType/:id']
      req = new Request 'GET', '/api/numberType/aa'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if the type is valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/numberType/:id']
      req = new Request 'GET', '/api/numberType/1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should be correctly validated if minimum is valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/number/:id']
      req = new Request 'GET', '/api/number/10'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if minimum is not valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/number/:id']
      req = new Request 'GET', '/api/number/1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if maximum is valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/number/:id']
      req = new Request 'GET', '/api/number/10'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if maximum is not valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/number/:id']
      req = new Request 'GET', '/api/number/11'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

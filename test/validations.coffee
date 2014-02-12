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

    it 'Should throw an exception if the value type is incorrect - BOOLEAN', (done) =>
      # Arrange
      resource = @resources['/boolean/:id']
      req = new Request 'GET', '/api/boolean/aa'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if the type is valid - BOOLEAN', (done) =>
      # Arrange
      resource = @resources['/boolean/:id']
      req = new Request 'GET', '/api/boolean/true'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()    

    it 'Should throw an exception if the value type is incorrect - DATE', (done) =>
      # Arrange
      resource = @resources['/date/:id']
      req = new Request 'GET', '/api/date/aa'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()  

    it 'Should be correctly validated if the type is valid - DATE', (done) =>
      # Arrange
      resource = @resources['/date/:id']
      req = new Request 'GET', '/api/date/Sun, 06 Nov 1994 08:49:37 GMT'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()    

  describe 'QUERY PARAMETER VALIDATIONS', =>    
    it 'Should be correctly validated if min-length is valid - STRING', (done) =>
      # Arrange
      resource = @resources['/string']
      req = new Request 'GET', '/api/string?param=111'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', '111'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if min-length is not valid - STRING', (done) =>
      # Arrange
      resource = @resources['/string']
      req = new Request 'GET', '/api/string?param=1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', '1'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if max-length is valid - STRING', (done) =>
      # Arrange
      resource = @resources['/string']
      req = new Request 'GET', '/api/string?param=111'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', '111'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if max-length is not valid - STRING', (done) =>
      # Arrange
      resource = @resources['/string']
      req = new Request 'GET', '/api/string?param=1111'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', '1111'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if the parameter value is present in the enum - STRING', (done) =>
      # Arrange
      resource = @resources['/string']
      req = new Request 'POST', '/api/string?param=AAA'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', 'AAA'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if the parameter value is not present in the enum - STRING', (done) =>
      # Arrange
      resource = @resources['/string']
      req = new Request 'POST', '/api/string?param=1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', '1'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if pattern is matched by the parameter value - STRING', (done) =>
      # Arrange
      resource = @resources['/string']
      req = new Request 'PUT', '/api/string?param=a'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', 'a'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()    

    it 'Should throw an exception if pattern is not matched by the parameter value - STRING', (done) =>
      # Arrange
      resource = @resources['/string']
      req = new Request 'PUT', '/api/string?param=1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', '1'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()  

    it 'Should throw an exception if the value type is incorrect - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integerType']
      req = new Request 'GET', '/api/integerType?param=aa'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', 'aa'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if the type is valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integerType']
      req = new Request 'GET', '/api/integerType?param=1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', '1'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should be correctly validated if minimum is valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integer']
      req = new Request 'GET', '/api/integer?param=10'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', '10'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if minimum is not valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integer']
      req = new Request 'GET', '/api/integer?param=1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', '1'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if maximum is valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integer']
      req = new Request 'GET', '/api/integer?param=10'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', '10'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if maximum is not valid - INTEGER', (done) =>
      # Arrange
      resource = @resources['/integer']
      req = new Request 'GET', '/api/integer?param=11'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', '11'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should throw an exception if the value type is incorrect - NUMBER', (done) =>
      # Arrange
      resource = @resources['/numberType']
      req = new Request 'GET', '/api/numberType?param=aa'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', 'aa'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if the type is valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/numberType']
      req = new Request 'GET', '/api/numberType?param=1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', '1'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should be correctly validated if minimum is valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/number']
      req = new Request 'GET', '/api/number?param=10'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', '10'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if minimum is not valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/number']
      req = new Request 'GET', '/api/number?param=1'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', '1'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if maximum is valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/number']
      req = new Request 'GET', '/api/number?param=10'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', '10'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()

    it 'Should throw an exception if maximum is not valid - NUMBER', (done) =>
      # Arrange
      resource = @resources['/number']
      req = new Request 'GET', '/api/number?param=11'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addQueryParameter 'param', '11'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should throw an exception if the value type is incorrect - BOOLEAN', (done) =>
      # Arrange
      resource = @resources['/boolean']
      req = new Request 'GET', '/api/boolean?param=aa'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', 'aa'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()

    it 'Should be correctly validated if the type is valid - BOOLEAN', (done) =>
      # Arrange
      resource = @resources['/boolean']
      req = new Request 'GET', '/api/boolean?param=true'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', 'true'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done()    

    it 'Should throw an exception if the value type is incorrect - DATE', (done) =>
      # Arrange
      resource = @resources['/date']
      req = new Request 'GET', '/api/date?param=aa'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', 'aa'

      # Assert
      ( ->
        validation.validate()
      ).should.throw();

      done()  

    it 'Should be correctly validated if the type is valid - DATE', (done) =>
      # Arrange
      resource = @resources['/date']
      req = new Request 'GET', '/api/date?param=Sun, 06 Nov 1994 08:49:37 GMT'
      validation = new Validation req, @uriTemplateReader, resource, '/api'

      req.addHeader 'content-type', 'application/json'
      req.addQueryParameter 'param', 'Sun, 06 Nov 1994 08:49:37 GMT'

      # Assert
      ( ->
        validation.validate()
      ).should.not.throw();

      done() 
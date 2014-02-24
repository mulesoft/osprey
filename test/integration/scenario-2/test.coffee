should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8001
apiPath = 'http://localhost:8001/api'

describe 'SCENARIO 2 - RAML BASED MOCKS + VALIDATIONS', ->
  describe 'QUERY PARAMETER - VALIDATIONS', ->
    it 'Should response 200 if the query parameter is valid', (done) ->
      request(apiPath)
        .get('/validations')
        .query('param=GET')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 200

          done()
        )

    it 'Should response 400 if the query parameter is invalid', (done) ->
      request(apiPath)
        .get('/validations')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )

  describe 'URI PARAMETER - VALIDATIONS', ->
    it 'Should response 200 if the query parameter is valid', (done) ->
      request(apiPath)
        .get('/validations/10')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 200

          done()
        )

    it 'Should response 400 if the query parameter is invalid', (done) ->
      request(apiPath)
        .get('/validations/1')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )

  describe 'FORM PARAMETER - VALIDATIONS', ->
    it 'Should response 200 if the query parameter is valid', (done) ->
      request(apiPath)
        .post('/validations')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ param: 'val' })
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 200

          done()
        )

    it 'Should response 400 if the query parameter is invalid', (done) ->
      request(apiPath)
        .post('/validations')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )

  describe 'HEADER - VALIDATIONS', ->
    it 'Should response 400 if the query parameter is invalid', (done) ->
      request(apiPath)
        .put('/validations')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )

  describe 'JSON SCHEMA - VALIDATIONS', ->
    it 'Should response 200 if the request body is valid', (done) ->
      request(apiPath)
        .post('/validations')
        .set('Content-Type', 'application/json')
        .send({ id: 'aaa' })
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 200

          done()
        )

    it 'Should response 400 if the request body is invalid', (done) ->
      request(apiPath)
        .post('/validations')
        .set('Content-Type', 'application/json')
        .send({ id: 'a' })
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )

  describe 'XML SCHEMA - VALIDATIONS', ->
    it 'Should response 200 if the request body is valid', (done) ->
      request(apiPath)
        .post('/validations')
        .type('xml')
        .send('<?xml version="1.0" ?><league><name>test</name></league>')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 200

          done()
        )

    it 'Should response 400 if the request body is invalid', (done) ->
      request(apiPath)
        .post('/validations')
        .set('Content-Type', 'application/xml')
        .send('<?xml version="1.0" ?><league>test</league>')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )        
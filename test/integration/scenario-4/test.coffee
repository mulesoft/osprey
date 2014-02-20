should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8003
apiPath = 'http://localhost:8003/api'

describe 'SCENARIO 4 - OVERWRITE RESOURCES + VALIDATIONS', ->
  describe 'QUERY PARAMETER - VALIDATIONS', ->
    it 'Should response 200 if the query parameter is valid', (done) ->
      request(apiPath)
        .get('/overwrite-validations')
        .query('param=GET')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 200

          done()
        )

    it 'Should response 400 if the query parameter is invalid', (done) ->
      request(apiPath)
        .get('/overwrite-validations')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )

  describe 'URI PARAMETER - VALIDATIONS', ->
    it 'Should response 200 if the query parameter is valid', (done) ->
      request(apiPath)
        .get('/overwrite-validations/10')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 200

          done()
        )

    it 'Should response 400 if the query parameter is invalid', (done) ->
      request(apiPath)
        .get('/overwrite-validations/1')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )

  describe 'FORM PARAMETER - VALIDATIONS', ->
    it 'Should response 200 if the query parameter is valid', (done) ->
      request(apiPath)
        .post('/overwrite-validations')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ param: 'val' })
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 201

          done()
        )

    it 'Should response 400 if the query parameter is invalid', (done) ->
      request(apiPath)
        .post('/overwrite-validations')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )

  describe 'HEADER - VALIDATIONS', ->
    it 'Should response 400 if the query parameter is invalid', (done) ->
      request(apiPath)
        .put('/overwrite-validations/10')
        .end((err, res) ->
          # Assert
          res.status.should.be.eql 400

          done()
        )
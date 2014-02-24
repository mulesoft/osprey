should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8005
apiPath = 'http://localhost:8005/api'

describe 'SCENARIO 6 - DEFAULT PARAMETERS', ->
  describe 'QUERY PARAMETERS', ->
    it 'Should add a query parameter if it is not present', (done) ->
      request(apiPath)
        .get('/default-parameters')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.body.param.should.eql 'QUERY PARAMETER'

          done()
        )

    it 'Should use the assigned value', (done) ->
      request(apiPath)
        .get('/default-parameters')
        .query('param=CUSTOM')
        .set('Accept', 'application/json')
        .set('header', 'CUSTOM')
        .end((err, res) ->
          # Assert
          res.body.param.should.eql 'CUSTOM'

          done()
        )

  describe 'FORM PARAMETERS', ->
    it 'Should add a form parameter if it is not present', (done) ->
      request(apiPath)
        .post('/default-parameters')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end((err, res) ->
          # Assert
          res.body.param.should.eql 'FORM PARAMETER'

          done()
        )

    it 'Should use the assigned value', (done) ->
      request(apiPath)
        .post('/default-parameters')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ param: 'CUSTOM' })
        .end((err, res) ->
          # Assert
          res.body.param.should.eql 'CUSTOM'

          done()
        )

  describe 'HEADERS', ->
    it 'Should add a headers if it is not present', (done) ->
      request(apiPath)
        .get('/default-parameters')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # Assert
          res.body.header.should.eql 'HEADER'

          done()
        )

    it 'Should use the assigned value', (done) ->
      request(apiPath)
        .get('/default-parameters')
        .query('param=CUSTOM')
        .set('Accept', 'application/json')
        .set('header', 'CUSTOM')
        .end((err, res) ->
          # Assert
          res.body.header.should.eql 'CUSTOM'

          done()
        )

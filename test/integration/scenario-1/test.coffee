should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8000
apiPath = 'http://localhost:8000/api'

describe 'SCENARIO 1', ->
  describe 'GET /resources', ->
    it 'Should support GET', (done) ->
      request(apiPath)
        .get('/resources')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # HTTP
          res.headers['content-type'].should.be.eql 'application/json'
          res.status.should.be.eql 200

          # DATA
          res.body.should.have.lengthOf 2
          res.body[0].id.should.eql 1
          res.body[0].description.should.eql 'description'
          res.body[1].id.should.eql 2
          res.body[1].description.should.eql 'description'

          done()
        )

    it 'Should support POST', (done) ->
      request(apiPath)
        .post('/resources')
        .end((err, res) ->
          # HTTP
          res.headers['content-type'].should.be.eql 'application/json'
          res.status.should.be.eql 200 # It should be 201

          # DATA
          res.body.description.should.eql 'description'
        
          done()
        )

    it 'Should support PUT', (done) ->
      request(apiPath)
        .put('/resources')
        .end((err, res) ->
          # HTTP
          res.headers['content-type'].should.be.eql 'application/json'
          res.status.should.be.eql 200 # It should be 204

          # DATA
          res.body.description.should.eql 'description'
        
          done()
        )

    it 'Should support DELETE', (done) ->
      request(apiPath)
        .del('/resources')
        .end((err, res) ->
          # HTTP
          res.status.should.be.eql 204
        
          done()
        )

  describe 'GET /resources/:id', ->
    it 'respond with json', (done) ->
      request(apiPath)
        .get('/resources/1')
        .set('Accept', 'application/json')
        .end((err, res) ->
          # HTTP
          res.headers['content-type'].should.be.eql 'application/json'
          res.status.should.be.eql 200

          # DATA
          res.body.id.should.eql 1
          res.body.description.should.eql 'description'

          done()
        )
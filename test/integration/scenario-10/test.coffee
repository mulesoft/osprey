should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8009
apiPath = 'http://localhost:8009/api'

describe 'SCENARIO 10 - MIDDLEWARES', ->
  describe 'GET /resources', ->
    it 'Should request GET properly', (done) ->
      request(apiPath)
        .get('/resources/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(done)

  describe 'DELETE /resources/:id', ->
    it 'Should request DELETE properly', (done) ->
      request(apiPath)
        .get('/resources/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(done)
  describe 'POST /resources', ->
    it 'Should pass valid middlewares', (done) ->
      request(apiPath)
        .post('/resources')
        .send({data: 'this is a post'})
        .expect(200)
        .end(done)
    it 'Should not pass if data is not provided', (done) ->
      request(apiPath)
        .post('/resources')
        .send({something: 'nothing'})
        .expect(400)
        .end(done)
    it 'Should not pass if data is not a string', (done) ->
      request(apiPath)
        .post('/resources')
        .send({something: {foo: 'bar'}})
        .expect(400)
        .end(done)

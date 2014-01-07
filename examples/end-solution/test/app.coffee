# app = require '../src/app'
should = require 'should'
request = require 'supertest'

apiPath = 'http://localhost:3000/api'

describe 'GET /teams', ->
  it 'respond with json', (done) ->
    request(apiPath)
      .get('/teams')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
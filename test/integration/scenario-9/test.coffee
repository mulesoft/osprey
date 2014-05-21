should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8008
apiPath = 'http://localhost:8008/api'

describe 'SCENARIO 9 - MISCELLANEOUS', ->
  it 'Should not wrap unhandled exceptions', (done) ->
    request(apiPath)
      .get('/miscellaneous')
      .set('Accept', 'application/json')
      .end((err, res) ->
        # Assert
        res.status.should.be.eql 500
        done()
      )

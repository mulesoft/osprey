should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8008
apiPath = 'http://localhost:8008'

describe 'SCENARIO 9 - MISCELLANEOUS', ->
  it 'Should not wrap unhandled exceptions', (done) ->
    request(apiPath)
      .get('/api/miscellaneous')
      .set('Accept', 'application/json')
      .end((err, res) ->
        # Assert
        res.status.should.be.eql 500
        done()
      )

  it 'should correctly update the baseUri', (done) ->
    request(apiPath)
      .get('/api')
      .set('Accept', 'application/raml+yaml')
      .end((err, res) ->
        # Assert
        baseUri = res.text.match(/^baseUri:.*$/gmi)[0].split(': ')[1]
        baseUri.should.be.eql 'http://localhost:8008/api'
        done()
      )

  it 'should correctly update the baseUri of a mounted app', (done) ->
    request(apiPath)
      .get('/app2/api')
      .set('Accept', 'application/raml+yaml')
      .end((err, res) ->
        # Assert
        baseUri = res.text.match(/^baseUri:.*$/gmi)[0].split(': ')[1]
        baseUri.should.be.eql 'http://localhost:8008/app2/api'
        done()
      )


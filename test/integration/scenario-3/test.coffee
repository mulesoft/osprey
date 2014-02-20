should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8002
apiPath = 'http://localhost:8002/api'

describe 'SCENARIO 3 - OVERWRITING RESOURCES', ->
  describe 'OVERWRITE A ROOT RESOURCE', ->
    describe 'GET /overwrite', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .get('/overwrite')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200
            res.body.should.have.lengthOf 1
            res.body[0].id.should.eql 1
            res.body[0].description.should.eql 'GET'

            done()
          )

      it 'Should return application/json as a content-type', (done) ->
        request(apiPath)
          .get('/overwrite')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'

            done()
          )

      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .get('/overwrite')
          .set('Accept', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )

    describe 'POST /overwrite', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .post('/overwrite')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201
            res.body.description.should.eql 'POST'
          
            done()
          )

      it 'Should return application/json as a content-type', (done) ->
        request(apiPath)
          .post('/overwrite')
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'
          
            done()
          )

      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .post('/overwrite')
          .set('Accept', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )

      it 'Should return 415 if required content-type is not supported', (done) ->
        request(apiPath)
          .post('/overwrite')
          .set('Content-Type', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 415
            done()
          )

    describe 'HEAD /overwrite', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .head('/overwrite')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'HEAD'

            done()
          )

  describe 'OVERWRITE A NESTED RESOURCE', ->
    describe 'GET /overwrite/:id', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .get('/overwrite/1')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200
            res.body.id.should.eql 1
            res.body.description.should.eql 'GET'

            done()
          )

      it 'Should return application/json as a content-type', (done) ->
        request(apiPath)
          .get('/overwrite/1')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'

            done()
          )

      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .get('/overwrite/1')
          .set('Accept', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )

    describe 'PUT /overwrite/:id', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .put('/overwrite/1')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'PUT'
            res.body.should.eql {}
          
            done()
          )

      it 'Should return 415 if required content-type is not supported', (done) ->
        request(apiPath)
          .put('/overwrite/1')
          .set('Content-Type', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 415
            done()
          )

    describe 'PATCH /overwrite/:id', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .patch('/overwrite/1')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'PATCH'
            res.body.should.eql {}
          
            done()
          )

      it 'Should return 415 if required content-type is not supported', (done) ->
        request(apiPath)
          .patch('/overwrite/1')
          .set('Content-Type', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 415
            done()
          )

    describe 'DELETE /overwrite/:id', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .del('/overwrite/1')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'DELETE'

            done()
          )

  describe 'OTHER', ->
    describe 'GET /not-overwritten', ->
      it 'Should response 404 if a RAML resource was not overwritten', (done) ->
        request(apiPath)
          .get('/not-overwritten')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 404

            done()
          )

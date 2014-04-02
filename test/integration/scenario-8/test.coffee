should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8007
api1Path = 'http://localhost:8007/api1'
api2Path = 'http://localhost:8007/api2'

describe 'SCENARIO 8 - MULTIPLE APIs', ->
  describe 'API 1', ->
    describe 'OVERWRITE A ROOT RESOURCE', ->
      describe 'GET /overwrite', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api1Path)
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
          request(api1Path)
            .get('/overwrite')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'

              done()
            )

        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(api1Path)
            .get('/overwrite')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

      describe 'POST /overwrite', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api1Path)
            .post('/overwrite')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 201
              res.body.description.should.eql 'POST'
            
              done()
            )

        it 'Should return application/json as a content-type', (done) ->
          request(api1Path)
            .post('/overwrite')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'
            
              done()
            )

        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(api1Path)
            .post('/overwrite')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(api1Path)
            .post('/overwrite')
            .set('Content-Type', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

      describe 'HEAD /overwrite', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api1Path)
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
          request(api1Path)
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
          request(api1Path)
            .get('/overwrite/1')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'

              done()
            )

        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(api1Path)
            .get('/overwrite/1')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

      describe 'PUT /overwrite/:id', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api1Path)
            .put('/overwrite/1')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204
              res.headers['header'] .should.be.eql 'PUT'
              res.body.should.eql {}
            
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(api1Path)
            .put('/overwrite/1')
            .set('Content-Type', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

      describe 'PATCH /overwrite/:id', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api1Path)
            .patch('/overwrite/1')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204
              res.headers['header'] .should.be.eql 'PATCH'
              res.body.should.eql {}
            
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(api1Path)
            .patch('/overwrite/1')
            .set('Content-Type', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

      describe 'DELETE /overwrite/:id', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api1Path)
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
          request(api1Path)
            .get('/not-overwritten')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 404

              done()
            )

  describe 'API 2', ->
    describe 'OVERWRITE A ROOT RESOURCE', ->
      describe 'GET /overwrite', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api2Path)
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
          request(api2Path)
            .get('/overwrite')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'

              done()
            )

        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(api2Path)
            .get('/overwrite')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

      describe 'POST /overwrite', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api2Path)
            .post('/overwrite')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 201
              res.body.description.should.eql 'POST'
            
              done()
            )

        it 'Should return application/json as a content-type', (done) ->
          request(api2Path)
            .post('/overwrite')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'
            
              done()
            )

        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(api2Path)
            .post('/overwrite')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(api2Path)
            .post('/overwrite')
            .set('Content-Type', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

      describe 'HEAD /overwrite', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api2Path)
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
          request(api2Path)
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
          request(api2Path)
            .get('/overwrite/1')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'

              done()
            )

        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(api2Path)
            .get('/overwrite/1')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

      describe 'PUT /overwrite/:id', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api2Path)
            .put('/overwrite/1')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204
              res.headers['header'] .should.be.eql 'PUT'
              res.body.should.eql {}
            
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(api2Path)
            .put('/overwrite/1')
            .set('Content-Type', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

      describe 'PATCH /overwrite/:id', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api2Path)
            .patch('/overwrite/1')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204
              res.headers['header'] .should.be.eql 'PATCH'
              res.body.should.eql {}
            
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(api2Path)
            .patch('/overwrite/1')
            .set('Content-Type', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

      describe 'DELETE /overwrite/:id', ->
        it 'Should response with the overwrite handler', (done) ->
          request(api2Path)
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
          request(api2Path)
            .get('/not-overwritten')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 404

              done()
            )
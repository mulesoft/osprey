should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8000
apiPath = 'http://localhost:8000/api'

describe 'SCENARIO 1 - RAML BASED MOCKS', ->
  describe 'ROOT RESOURCE', ->
    describe 'GET /resources', ->
      it 'Should use the first status code defined in RAML (200)', (done) ->
        request(apiPath)
          .get('/resources')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200

            done()
          )

      it 'Should response with the example defined in RAML', (done) ->
        request(apiPath)
          .get('/resources')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.body.should.have.lengthOf 2
            res.body[0].id.should.eql 1
            res.body[0].description.should.eql 'description'
            res.body[1].id.should.eql 2
            res.body[1].description.should.eql 'description'

            done()
          )

      it 'Should have response headers if they have default values in RAML', (done) ->
        request(apiPath)
          .get('/resources')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.headers['header'] .should.be.eql 'GET'

            done()
          )

      it 'Should return application/json as a content-type', (done) ->
        request(apiPath)
          .get('/resources')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'

            done()
          )

      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .get('/resources')
          .set('Accept', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )


    describe 'POST /resources', ->
      it 'Should use the first status code defined in RAML (201)', (done) ->
        request(apiPath)
          .post('/resources')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201
            res.body.description.should.eql 'description'
          
            done()
          )

      it 'Should response with the example defined in RAML', (done) ->
        request(apiPath)
          .post('/resources')
          .end((err, res) ->
            # Assert
            res.body.description.should.eql 'description'
          
            done()
          )

      it 'Should have response headers if they have default values in RAML', (done) ->
        request(apiPath)
          .post('/resources')
          .end((err, res) ->
            # Assert
            res.headers['header'] .should.be.eql 'POST'
          
            done()
          )

      it 'Should return application/json as a content-type', (done) ->
        request(apiPath)
          .post('/resources')
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'
          
            done()
          )

      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .post('/resources')
          .set('Accept', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )

      it 'Should return 415 if required content-type is not supported', (done) ->
        request(apiPath)
          .post('/resources')
          .set('Content-Type', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 415
            done()
          )

    describe 'PUT /resources', ->
      it 'Should use the first status code defined in RAML (204)', (done) ->
        request(apiPath)
          .put('/resources')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.body.should.eql {}
          
            done()
          )

      it 'Should have response headers if they have default values in RAML', (done) ->
        request(apiPath)
          .put('/resources')
          .end((err, res) ->
            # Assert
            res.headers['header'] .should.be.eql 'PUT'
            res.body.should.eql {}
          
            done()
          )

      it 'Should return 415 if required content-type is not supported', (done) ->
        request(apiPath)
          .put('/resources')
          .set('Content-Type', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 415
            done()
          )

    describe 'HEAD /resources', ->
      it 'Should use the first status code defined in RAML (204)', (done) ->
        request(apiPath)
          .head('/resources')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204

            done()
          )

      it 'Should have response headers if they have default values in RAML', (done) ->
        request(apiPath)
          .head('/resources')
          .end((err, res) ->
            # Assert
            res.headers['header'] .should.be.eql 'HEAD'

            done()
          )

    describe 'PATCH /resources', ->
      it 'Should use the first status code defined in RAML (204)', (done) ->
        request(apiPath)
          .patch('/resources')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.body.should.eql {}
          
            done()
          )

      it 'Should have response headers if they have default values in RAML', (done) ->
        request(apiPath)
          .patch('/resources')
          .end((err, res) ->
            # Assert
            res.headers['header'] .should.be.eql 'PATCH'
            res.body.should.eql {}
          
            done()
          )

      it 'Should return 415 if required content-type is not supported', (done) ->
        request(apiPath)
          .patch('/resources')
          .set('Content-Type', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 415
            done()
          )


  describe 'NESTED RESOURCE', ->
    describe 'GET /resources/:id', ->
      it 'Should use the first status code defined in RAML (200)', (done) ->
        request(apiPath)
          .get('/resources/1')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200

            done()
          )

      it 'Should response with the example defined in RAML', (done) ->
        request(apiPath)
          .get('/resources/1')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.body.id.should.eql 1
            res.body.description.should.eql 'description'

            done()
          )

      it 'Should have response headers if they have default values in RAML', (done) ->
        request(apiPath)
          .get('/resources/1')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.headers['header'] .should.be.eql 'GET'

            done()
          )

      it 'Should return application/json as a content-type', (done) ->
        request(apiPath)
          .get('/resources/1')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'

            done()
          )


      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .get('/resources/1')
          .set('Accept', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )

    describe 'DELETE /resources/:id', ->
      it 'Should use the first status code defined in RAML (204)', (done) ->
        request(apiPath)
          .del('/resources/1')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
          
            done()
          )

      it 'Should have response headers if they have default values in RAML', (done) ->
        request(apiPath)
          .del('/resources/1')
          .end((err, res) ->
            # Assert
            res.headers['header'] .should.be.eql 'DELETE'
          
            done()
          )

    describe 'HEAD /resources/:id', ->
      it 'Should use the first status code defined in RAML (204)', (done) ->
        request(apiPath)
          .head('/resources/1')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'HEAD'

            done()
          )

      it 'Should have response headers if they have default values in RAML', (done) ->
        request(apiPath)
          .head('/resources/1')
          .end((err, res) ->
            # Assert
            res.headers['header'] .should.be.eql 'HEAD'

            done()
          )

  describe 'RESOURCE WITHOUT EXAMPLE', ->
    describe 'GET /empty', ->
      it 'Should use the first status code defined in RAML (200)', (done) ->
        request(apiPath)
          .get('/empty')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200

            done()
          )

      it 'Should response with the example defined in RAML', (done) ->
          request(apiPath)
            .get('/empty')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.body.should.be.eql {}

              done()
            )

        it 'Should have response headers if they have default values in RAML', (done) ->
          request(apiPath)
            .get('/empty')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'GET'

              done()
            )

        it 'Should return application/json as a content-type', (done) ->
          request(apiPath)
            .get('/resources')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'

              done()
            )

        it 'Should turn off content negotiation if there is no body defined in RAML', (done) ->
          request(apiPath)
            .get('/empty')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 200
              done()
            )
should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8004
apiPath = 'http://localhost:8004/api'

describe 'SCENARIO 5 - OVERWRITE RESOURCES + VALIDATIONS + MOCKS', ->
  describe 'OVERWRITE A ROOT RESOURCE', ->
    describe 'GET /all', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .get('/all')
          .query('param=GET')
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
          .get('/all')
          .query('param=GET')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'

            done()
          )

      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .get('/all')
          .query('param=GET')
          .set('Accept', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )

    describe 'POST /all', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .post('/all')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({ param: 'val' })
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201
            res.body.description.should.eql 'POST'
          
            done()
          )

      it 'Should return application/json as a content-type', (done) ->
        request(apiPath)
          .post('/all')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({ param: 'val' })
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'
          
            done()
          )

      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .post('/all')
          .set('Accept', 'application/xml')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({ param: 'val' })
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )

    describe 'HEAD /all', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .head('/all')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'HEAD'

            done()
          )

  describe 'OVERWRITE A NESTED RESOURCE', ->
    describe 'GET /all/:id', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .get('/all/10')
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
          .get('/all/10')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.headers['content-type'].should.be.eql 'application/json'

            done()
          )

      it 'Should return 406 if required accept-type is not supported', (done) ->
        request(apiPath)
          .get('/all/10')
          .set('Accept', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 406
            done()
          )

    describe 'PUT /all/:id', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .put('/all/10')
          .set('header', 'a')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'PUT'
            res.body.should.eql {}
          
            done()
          )

      it 'Should return 415 if required content-type is not supported', (done) ->
        request(apiPath)
          .put('/all/10')
          .set('Content-Type', 'application/xml')
          .set('header', 'a')
          .end((err, res) ->
            res.status.should.be.eql 415
            done()
          )

    describe 'PATCH /all/:id', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .patch('/all/10')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'PATCH'
            res.body.should.eql {}
          
            done()
          )

      it 'Should return 415 if required content-type is not supported', (done) ->
        request(apiPath)
          .patch('/all/10')
          .set('Content-Type', 'application/xml')
          .end((err, res) ->
            res.status.should.be.eql 415
            done()
          )

    describe 'DELETE /all/:id', ->
      it 'Should response with the overwrite handler', (done) ->
        request(apiPath)
          .del('/all/10')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 204
            res.headers['header'] .should.be.eql 'DELETE'

            done()
          )

  # describe 'MOCK ROOT RESOURCE', ->
  #   describe 'GET /resources', ->
  #     it 'Should use the first status code defined in RAML (200)', (done) ->
  #       request(apiPath)
  #         .get('/resources')
  #         .set('Accept', 'application/json')
  #         .end((err, res) ->
  #           # Assert
  #           res.status.should.be.eql 200

  #           done()
  #         )

  #     it 'Should response with the example defined in RAML', (done) ->
  #       request(apiPath)
  #         .get('/resources')
  #         .set('Accept', 'application/json')
  #         .end((err, res) ->
  #           # Assert
  #           res.body.should.have.lengthOf 2
  #           res.body[0].id.should.eql 1
  #           res.body[0].description.should.eql 'description'
  #           res.body[1].id.should.eql 2
  #           res.body[1].description.should.eql 'description'

  #           done()
  #         )

  #     it 'Should have response headers if they have default values in RAML', (done) ->
  #       request(apiPath)
  #         .get('/resources')
  #         .set('Accept', 'application/json')
  #         .end((err, res) ->
  #           # Assert
  #           res.headers['header'] .should.be.eql 'GET'

  #           done()
  #         )

  #     it 'Should return application/json as a content-type', (done) ->
  #       request(apiPath)
  #         .get('/resources')
  #         .set('Accept', 'application/json')
  #         .end((err, res) ->
  #           # Assert
  #           res.headers['content-type'].should.be.eql 'application/json'

  #           done()
  #         )

  #     it 'Should return 406 if required accept-type is not supported', (done) ->
  #       request(apiPath)
  #         .get('/resources')
  #         .set('Accept', 'application/xml')
  #         .end((err, res) ->
  #           res.status.should.be.eql 406
  #           done()
  #         )

  #   describe 'POST /resources', ->
  #     it 'Should use the first status code defined in RAML (201)', (done) ->
  #       request(apiPath)
  #         .post('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.status.should.be.eql 201
  #           res.body.description.should.eql 'description'
          
  #           done()
  #         )

  #     it 'Should response with the example defined in RAML', (done) ->
  #       request(apiPath)
  #         .post('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.body.description.should.eql 'description'
          
  #           done()
  #         )

  #     it 'Should have response headers if they have default values in RAML', (done) ->
  #       request(apiPath)
  #         .post('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.headers['header'] .should.be.eql 'POST'
          
  #           done()
  #         )

  #     it 'Should return application/json as a content-type', (done) ->
  #       request(apiPath)
  #         .post('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.headers['content-type'].should.be.eql 'application/json'
          
  #           done()
  #         )

  #     it 'Should return 406 if required accept-type is not supported', (done) ->
  #       request(apiPath)
  #         .post('/resources')
  #         .set('Accept', 'application/xml')
  #         .end((err, res) ->
  #           res.status.should.be.eql 406
  #           done()
  #         )

  #     it 'Should return 415 if required content-type is not supported', (done) ->
  #       request(apiPath)
  #         .post('/resources')
  #         .set('Content-Type', 'application/xml')
  #         .end((err, res) ->
  #           res.status.should.be.eql 415
  #           done()
  #         )

  #   describe 'PUT /resources', ->
  #     it 'Should use the first status code defined in RAML (204)', (done) ->
  #       request(apiPath)
  #         .put('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.status.should.be.eql 204
  #           res.body.should.eql {}
          
  #           done()
  #         )

  #     it 'Should have response headers if they have default values in RAML', (done) ->
  #       request(apiPath)
  #         .put('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.headers['header'] .should.be.eql 'PUT'
  #           res.body.should.eql {}
          
  #           done()
  #         )

  #     it 'Should return 415 if required content-type is not supported', (done) ->
  #       request(apiPath)
  #         .put('/resources')
  #         .set('Content-Type', 'application/xml')
  #         .end((err, res) ->
  #           res.status.should.be.eql 415
  #           done()
  #         )

  #   describe 'HEAD /resources', ->
  #     it 'Should use the first status code defined in RAML (204)', (done) ->
  #       request(apiPath)
  #         .head('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.status.should.be.eql 204

  #           done()
  #         )

  #     it 'Should have response headers if they have default values in RAML', (done) ->
  #       request(apiPath)
  #         .head('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.headers['header'] .should.be.eql 'HEAD'

  #           done()
  #         )

  #   describe 'PATCH /resources', ->
  #     it 'Should use the first status code defined in RAML (204)', (done) ->
  #       request(apiPath)
  #         .patch('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.status.should.be.eql 204
  #           res.body.should.eql {}
          
  #           done()
  #         )

  #     it 'Should have response headers if they have default values in RAML', (done) ->
  #       request(apiPath)
  #         .patch('/resources')
  #         .end((err, res) ->
  #           # Assert
  #           res.headers['header'] .should.be.eql 'PATCH'
  #           res.body.should.eql {}
          
  #           done()
  #         )

  #     it 'Should return 415 if required content-type is not supported', (done) ->
  #       request(apiPath)
  #         .patch('/resources')
  #         .set('Content-Type', 'application/xml')
  #         .end((err, res) ->
  #           res.status.should.be.eql 415
  #           done()
  #         )
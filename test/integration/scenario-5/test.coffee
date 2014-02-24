should = require 'should'
request = require 'supertest'
app = require './app'

app.listen 8004
apiPath = 'http://localhost:8004/api'

describe 'SCENARIO 5 - OVERWRITE RESOURCES + VALIDATIONS + MOCKS', ->
  describe 'OVERWRITE RESOURCES', ->

    describe 'ROOT RESOURCE', ->
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

    describe 'NESTED RESOURCE', ->
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

    describe 'QUERY PARAMETER VALIDATION', ->
      it 'Should response 200 if the query parameter is valid', (done) ->
        request(apiPath)
          .get('/all')
          .query('param=GET')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200

            done()
          )

      it 'Should response 400 if the query parameter is invalid', (done) ->
        request(apiPath)
          .get('/all')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'URI PARAMETER VALIDATION', ->
      it 'Should response 200 if the query parameter is valid', (done) ->
        request(apiPath)
          .get('/all/10')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200

            done()
          )

      it 'Should response 400 if the query parameter is invalid', (done) ->
        request(apiPath)
          .get('/all/1')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'FORM PARAMETER VALIDATION', ->
      it 'Should response 200 if the query parameter is valid', (done) ->
        request(apiPath)
          .post('/all')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({ param: 'val' })
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201

            done()
          )

      it 'Should response 400 if the query parameter is invalid', (done) ->
        request(apiPath)
          .post('/all')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'HEADER VALIDATION', ->
      it 'Should response 400 if the query parameter is invalid', (done) ->
        request(apiPath)
          .put('/all/10')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'JSON SCHEMA - VALIDATION', ->
      it 'Should response 201 if the request body is valid', (done) ->
        request(apiPath)
          .post('/all')
          .set('Content-Type', 'application/json')
          .send({ id: 'aaa' })
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201

            done()
          )

      it 'Should response 400 if the request body is invalid', (done) ->
        request(apiPath)
          .post('/all')
          .set('Content-Type', 'application/json')
          .send({ id: 'a' })
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'XML SCHEMA - VALIDATIONS', ->
      it 'Should response 200 if the request body is valid', (done) ->
        request(apiPath)
          .post('/all')
          .type('xml')
          .send('<?xml version="1.0" ?><league><name>test</name></league>')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201

            done()
          )

      it 'Should response 400 if the request body is invalid', (done) ->
        request(apiPath)
          .post('/all')
          .set('Content-Type', 'application/xml')
          .send('<?xml version="1.0" ?><league>test</league>')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )    

  describe 'MOCK RESOURCES', ->

    describe 'ROOT RESOURCE', ->
      describe 'GET /mocks', ->
        it 'Should use the first status code defined in RAML (200)', (done) ->
          request(apiPath)
            .get('/mocks')
            .query('param=GET')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 200

              done()
            )

        it 'Should response with the example defined in RAML', (done) ->
          request(apiPath)
            .get('/mocks')
            .set('Accept', 'application/json')
            .query('param=GET')
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
            .get('/mocks')
            .set('Accept', 'application/json')
            .query('param=GET')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'GET'

              done()
            )

        it 'Should return application/json as a content-type', (done) ->
          request(apiPath)
            .get('/mocks')
            .set('Accept', 'application/json')
            .query('param=GET')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'

              done()
            )

        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(apiPath)
            .get('/mocks')
            .set('Accept', 'application/xml')
            .query('param=GET')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

      describe 'POST /mocks', ->
        it 'Should use the first status code defined in RAML (201)', (done) ->
          request(apiPath)
            .post('/mocks')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 201
              res.body.description.should.eql 'description'
            
              done()
            )

        it 'Should response with the example defined in RAML', (done) ->
          request(apiPath)
            .post('/mocks')
            .end((err, res) ->
              # Assert
              res.body.description.should.eql 'description'
            
              done()
            )

        it 'Should have response headers if they have default values in RAML', (done) ->
          request(apiPath)
            .post('/mocks')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'POST'
            
              done()
            )

        it 'Should return application/json as a content-type', (done) ->
          request(apiPath)
            .post('/mocks')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'
            
              done()
            )

        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(apiPath)
            .post('/mocks')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(apiPath)
            .post('/mocks')
            .set('Content-Type', 'application/xls')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

      describe 'PUT /mocks', ->
        it 'Should use the first status code defined in RAML (204)', (done) ->
          request(apiPath)
            .put('/mocks')
            .set('header', 'a')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204
              res.body.should.eql {}
            
              done()
            )

        it 'Should have response headers if they have default values in RAML', (done) ->
          request(apiPath)
            .put('/mocks')
            .set('header', 'a')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'PUT'
              res.body.should.eql {}
            
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(apiPath)
            .put('/mocks')
            .set('header', 'a')
            .set('Content-Type', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

      describe 'HEAD /mocks', ->
        it 'Should use the first status code defined in RAML (204)', (done) ->
          request(apiPath)
            .head('/mocks')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204

              done()
            )

        it 'Should have response headers if they have default values in RAML', (done) ->
          request(apiPath)
            .head('/mocks')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'HEAD'

              done()
            )

      describe 'PATCH /mocks', ->
        it 'Should use the first status code defined in RAML (204)', (done) ->
          request(apiPath)
            .patch('/mocks')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204
              res.body.should.eql {}
            
              done()
            )

        it 'Should have response headers if they have default values in RAML', (done) ->
          request(apiPath)
            .patch('/mocks')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'PATCH'
              res.body.should.eql {}
            
              done()
            )

        it 'Should return 415 if required content-type is not supported', (done) ->
          request(apiPath)
            .patch('/mocks')
            .set('Content-Type', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 415
              done()
            )

    describe 'NESTED RESOURCE', ->
      describe 'GET /mocks/:id', ->
        it 'Should use the first status code defined in RAML (200)', (done) ->
          request(apiPath)
            .get('/mocks/10')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 200

              done()
            )

        it 'Should response with the example defined in RAML', (done) ->
          request(apiPath)
            .get('/mocks/10')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.body.id.should.eql 1
              res.body.description.should.eql 'description'

              done()
            )

        it 'Should have response headers if they have default values in RAML', (done) ->
          request(apiPath)
            .get('/mocks/10')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'GET'

              done()
            )

        it 'Should return application/json as a content-type', (done) ->
          request(apiPath)
            .get('/mocks/10')
            .set('Accept', 'application/json')
            .end((err, res) ->
              # Assert
              res.headers['content-type'].should.be.eql 'application/json'

              done()
            )


        it 'Should return 406 if required accept-type is not supported', (done) ->
          request(apiPath)
            .get('/mocks/10')
            .set('Accept', 'application/xml')
            .end((err, res) ->
              res.status.should.be.eql 406
              done()
            )

      describe 'DELETE /mocks/:id', ->
        it 'Should use the first status code defined in RAML (204)', (done) ->
          request(apiPath)
            .del('/mocks/10')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204
            
              done()
            )

        it 'Should have response headers if they have default values in RAML', (done) ->
          request(apiPath)
            .del('/mocks/10')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'DELETE'
            
              done()
            )

      describe 'HEAD /mocks/:id', ->
        it 'Should use the first status code defined in RAML (204)', (done) ->
          request(apiPath)
            .head('/mocks/10')
            .end((err, res) ->
              # Assert
              res.status.should.be.eql 204
              res.headers['header'] .should.be.eql 'HEAD'

              done()
            )

        it 'Should have response headers if they have default values in RAML', (done) ->
          request(apiPath)
            .head('/mocks/10')
            .end((err, res) ->
              # Assert
              res.headers['header'] .should.be.eql 'HEAD'

              done()
            )

    describe 'QUERY PARAMETER VALIDATION', ->
      it 'Should response 200 if the query parameter is valid', (done) ->
        request(apiPath)
          .get('/mocks')
          .query('param=GET')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200

            done()
          )

      it 'Should response 400 if the query parameter is invalid', (done) ->
        request(apiPath)
          .get('/mocks')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'URI PARAMETER VALIDATION', ->
      it 'Should response 200 if the query parameter is valid', (done) ->
        request(apiPath)
          .get('/mocks/10')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 200

            done()
          )

      it 'Should response 400 if the query parameter is invalid', (done) ->
        request(apiPath)
          .get('/mocks/1')
          .set('Accept', 'application/json')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'FORM PARAMETER VALIDATION', ->
      it 'Should response 200 if the query parameter is valid', (done) ->
        request(apiPath)
          .post('/mocks')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({ param: 'val' })
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201

            done()
          )

      it 'Should response 400 if the query parameter is invalid', (done) ->
        request(apiPath)
          .post('/mocks')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'HEADER VALIDATION', ->
      it 'Should response 400 if the query parameter is invalid', (done) ->
        request(apiPath)
          .put('/mocks')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'JSON SCHEMA - VALIDATION', ->
      it 'Should response 201 if the request body is valid', (done) ->
        request(apiPath)
          .post('/mocks')
          .set('Content-Type', 'application/json')
          .send({ id: 'aaa' })
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201

            done()
          )

      it 'Should response 400 if the request body is invalid', (done) ->
        request(apiPath)
          .post('/mocks')
          .set('Content-Type', 'application/json')
          .send({ id: 'a' })
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )

    describe 'XML SCHEMA - VALIDATIONS', ->
      it 'Should response 200 if the request body is valid', (done) ->
        request(apiPath)
          .post('/mocks')
          .type('xml')
          .send('<?xml version="1.0" ?><league><name>test</name></league>')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 201

            done()
          )

      it 'Should response 400 if the request body is invalid', (done) ->
        request(apiPath)
          .post('/mocks')
          .set('Content-Type', 'application/xml')
          .send('<?xml version="1.0" ?><league>test</league>')
          .end((err, res) ->
            # Assert
            res.status.should.be.eql 400

            done()
          )   
express = require 'express'
path = require 'path'
osprey = require '../../../src/lib'

app = express()

app.use express.json()
app.use express.urlencoded()

api1 = osprey.create '/api1', app, 
  ramlFile: path.join(__dirname, 'api1.raml')
  enableMocks: false
  enableValidations: false
  enableConsole: false
  logLevel: 'off'

api1.describe (osprey) ->
  osprey.get '/overwrite', (req, res) ->
    res.send([{
      id: 1
      description: 'GET' 
    }])

  osprey.post '/overwrite', (req, res) ->
    res.status 201
    res.send { description: 'POST' }

  osprey.head '/overwrite', (req, res) ->
    res.set 'header', 'HEAD'
    res.send 204

  osprey.get '/overwrite/:id', (req, res) ->
    res.send { id: 1, description: 'GET' }

  osprey.put '/overwrite/:id', (req, res) ->
    res.set 'header', 'PUT'
    res.send 204

  osprey.patch '/overwrite/:id', (req, res) ->
    res.set 'header', 'PATCH'
    res.send 204

  osprey.delete '/overwrite/:id', (req, res) ->
    res.set 'header', 'DELETE'
    res.send 204

api2 = osprey.create '/api2', app, 
  ramlFile: path.join(__dirname, 'api2.raml')
  enableMocks: false
  enableValidations: false
  enableConsole: false
  logLevel: 'off'

api2.describe (osprey) ->
  osprey.get '/overwrite', (req, res) ->
    res.send([{
      id: 1
      description: 'GET' 
    }])

  osprey.post '/overwrite', (req, res) ->
    res.status 201
    res.send { description: 'POST' }

  osprey.head '/overwrite', (req, res) ->
    res.set 'header', 'HEAD'
    res.send 204

  osprey.get '/overwrite/:id', (req, res) ->
    res.send { id: 1, description: 'GET' }

  osprey.put '/overwrite/:id', (req, res) ->
    res.set 'header', 'PUT'
    res.send 204

  osprey.patch '/overwrite/:id', (req, res) ->
    res.set 'header', 'PATCH'
    res.send 204

  osprey.delete '/overwrite/:id', (req, res) ->
    res.set 'header', 'DELETE'
    res.send 204

module.exports = app
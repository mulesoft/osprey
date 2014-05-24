express = require 'express'
path = require 'path'
osprey = require '../../../src/lib'

app = express()

app.use express.json()
app.use express.urlencoded()

api = osprey.create '/api', app,
  ramlFile: path.join(__dirname, 'api.raml')
  enableMocks: false
  enableValidations: false
  enableConsole: false
  logLevel: 'off'

api.get '/overwrite', (req, res) ->
  res.send([{
    id: 1
    description: 'GET'
  }])

api.post '/overwrite', (req, res) ->
  res.status 201
  res.send { description: 'POST' }

api.head '/overwrite', (req, res) ->
  res.set 'header', 'HEAD'
  res.send 204

api.get '/overwrite/:id', (req, res) ->
  res.send { id: 1, description: 'GET' }

api.put '/overwrite/:id', (req, res) ->
  res.set 'header', 'PUT'
  res.send 204

api.patch '/overwrite/:id', (req, res) ->
  res.set 'header', 'PATCH'
  res.send 204

api.delete '/overwrite/:id', (req, res) ->
  res.set 'header', 'DELETE'
  res.send 204

module.exports = app

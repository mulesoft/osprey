express = require 'express'
path = require 'path'
osprey = require '../../../src/lib'
xmlparser = require 'express-xml-bodyparser'

app = express()

app.use xmlparser()
app.use express.json()
app.use express.urlencoded()

api = osprey.create '/api', app,
  ramlFile: path.join(__dirname, 'api.raml')
  enableMocks: false
  enableValidations: true
  enableConsole: true
  logLevel: 'off'

api.get '/overwrite-validations', (req, res) ->
  res.send([{
    id: 1
    description: 'GET'
  }])

api.post '/overwrite-validations', (req, res) ->
  res.status 201
  res.send { description: 'POST' }

api.get '/overwrite-validations/:id', (req, res) ->
  res.send { id: 1, description: 'GET' }

api.put '/overwrite-validations/:id', (req, res) ->
  res.set 'header', 'PUT'
  res.send 204

module.exports = app

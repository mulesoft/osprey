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

api.get '/resources/:id',
  (req, res, next) -> 
    next()
  (req, res) ->
    res.status 200
    res.send { description: 'GET' }

api.post '/resources',
  (req, res, next) ->
    if not req.body.data
      res.send 400, {description: 'data property missing' }
    else
      next()
  (req, res, next) ->
    if typeof req.body.data == 'string'
      next()
    else
      res.send 400, {description: 'data should be a string' }
  (req, res) ->
    res.status 200
    res.send { description: 'POST' }

api.delete '/resources/:id',
  (req, res) ->
    console.log('hola')
    res.status 200
    res.send { description: 'DELETE' }

module.exports = app

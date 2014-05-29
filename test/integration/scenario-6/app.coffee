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

api.get '/default-parameters', (req, res) ->
  res.send
    header: req.headers.header
    param: req.query.param

api.post '/default-parameters', (req, res) ->
  res.send
    param: req.body.param

module.exports = app

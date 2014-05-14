express = require 'express'
path = require 'path'
osprey = require 'osprey'
CustomError = require './exceptions/custom-error'
app = module.exports = express()

app.use express.json()
app.use express.urlencoded()
app.use express.logger('dev')
app.set 'port', process.env.PORT || 3000

api = osprey.create '/api', app,
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  logLevel: 'debug',
  enableMocks: true,
  exceptionHandler:
    InvalidUriParameterError: (err, req, res) ->
      res.send 400
    CustomError: (err, req, res) ->
      console.log 'Custom Error'
      res.send 400

api.describe (api) ->
  api.get '/teams/:teamId', (req, res) ->
    res.send({ name: 'test' })

  api.get '/teams', (req, res) ->
    throw new CustomError 'some exception'

  api.get '/teamss', (req, res) ->
    res.send 200
.then (app) ->
  unless module.parent
    port = app.get('port')
    app.listen port
    console.log "listening on port #{port}"

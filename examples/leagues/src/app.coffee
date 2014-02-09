express = require 'express'
path = require 'path'
osprey = require 'osprey'
CustomError = require './exceptions/custom-error'

app = module.exports = express()

app.use express.bodyParser()
app.use express.methodOverride()
app.use express.compress()
app.use express.logger('dev')

app.set 'port', process.env.PORT || 3000

# Osprey Configuration
# osprey.validations '/api', app,
#   ramlFile: path.join(__dirname, '/assets/raml/api.raml')

# router = osprey.route '/api', app,
#   ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
#   enableMocks: true

# app.use apiKit.exceptionHandler '/api', app,
#   Error: (err, req, res) ->
#     console.log 'CustomError'
#     res.send 400

api = osprey.create '/api', app,
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  logLevel: 'debug',
  exceptionHandler:
    InvalidAcceptTypeError: (err, req, res) ->
      res.send 406

    InvalidContentTypeError: (err, req, res) ->
      res.send 415

    Error: (err, req, res) ->
      res.send 400

# Example:
# api.get '/teams/:teamId', (req, res) ->
#   res.send({ name: 'test' })

api.get '/teams', (req, res) ->
  throw new Error 'some exception'

unless module.parent
  port = app.get('port')
  app.listen port
  console.log "listening on port #{port}"

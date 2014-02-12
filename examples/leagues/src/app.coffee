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

# Osprey Validations
# osprey.validations '/api', app,
#   ramlFile: path.join(__dirname, '/assets/raml/api.raml')

# Osprey Router
# router = osprey.route '/api', app,
#   ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
#   enableMocks: true

# Osprey Exception Handler
# osprey.exceptionHandler '/api', app,
#   CustomError: (err, req, res) ->
#     console.log 'Custom Error'
#     res.send 400

api = osprey.create '/api', app,
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  logLevel: 'debug',
  exceptionHandler:
    InvalidUriParameterError: (err, req, res) ->
      console.log 'Overwriting default implementation'
      res.send 400
    CustomError: (err, req, res) ->
      console.log 'Custom Error'
      res.send 400

# Example:
# api.get '/teams/:teamId', (req, res) ->
#   res.send({ name: 'test' })

api.get '/teams', (req, res) ->
  throw new CustomError 'some exception'

api.get '/teamss', (req, res) ->
  res.send 200

unless module.parent
  port = app.get('port')
  app.listen port
  console.log "listening on port #{port}"

express = require 'express'
path = require 'path'
osprey = require 'osprey'

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

api = osprey.create '/api', app,
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  enableConsole: true,
  enableMocks: true,
  enableValidations: true,
  logLevel: 'dev'

# Example:
# api.get '/teams/:teamId', (req, res) ->
#   res.send({ name: 'test' })

api.get '/teams/:teamId', (req, res) ->
  res.send({ name: 'test' })

api.get '/teams2', (req, res) ->
  res.send({ name: 'test' })

unless module.parent
  port = app.get('port')
  app.listen port
  console.log "listening on port #{port}"
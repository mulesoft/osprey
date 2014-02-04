express = require 'express'
path = require 'path'
apiKit = require 'apikit-node'
CustomError = require './exceptions/custom-error'

app = module.exports = express()

app.use express.bodyParser()
app.use express.methodOverride()
app.use express.compress()
app.use express.logger('dev')

app.set 'port', process.env.PORT || 3000

# APIKit Configuration
# app.use apiKit.validations '/api', app,
#   ramlFile: path.join(__dirname, '/assets/raml/api.raml')

# app.use apiKit.route '/api', app,
#   ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
#   enableMocks: false

# app.use apiKit.exceptionHandler '/api', app,
#   Error: (err, req, res) ->
#     console.log 'CustomError'
#     res.send 400

apiKit.register '/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  exceptionHandler: {
    Error: (err, req, res) ->
      res.send 400
  }
}

# TODO: Throw an exception if the route is not present in the raml!
# apiKit.get '/teams/:teamId', (req, res) ->
#   res.send({ name: 'test' })

apiKit.get '/teams', (req, res) ->
  throw new Error 'some exception'

unless module.parent
  port = app.get('port')
  app.listen port
  console.log "listening on port #{port}"

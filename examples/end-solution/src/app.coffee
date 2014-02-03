express = require 'express'
path = require 'path'
apiKit = require 'apikit-node'

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

apiKit.register '/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  enableConsole: true,
  enableMocks: true,
  enableValidations: true
}

# TODO: Throw an exception if the route is not present in the raml!
# apiKit.get '/teams/:teamId', (req, res) ->
#   res.send({ name: 'test' })

# apiKit.get '/teams', (req, res) ->
#   res.send({ name: 'test' })

unless module.parent
  app.listen app.get('port')
  console.log 'listening on port 3000'
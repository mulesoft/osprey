express = require 'express'
http = require 'http'
path = require 'path'
apiKit = require 'apikit-node'

app = module.exports = express()

app.use express.bodyParser()
app.use express.methodOverride()
app.use express.compress()
app.use express.logger('dev')

app.set 'port', process.env.PORT || 3000

# APIKit Configuration
# app.use apiKit.ramlRouting('/api', __dirname + '/assets/raml/api.raml', app.routes)
# app.use '/api/console', express.static(__dirname + '/assets/console')
# app.get '/api', apiKit.ramlEndpoint(__dirname + '/assets/raml/api.raml')

apiKit.register '/api', app, __dirname

unless module.parent
  app.listen app.get('port')
  console.log 'listening on port 3000'

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
# app.use apiKit.route('/api', __dirname + '/assets/raml/api.raml', app.routes)

apiKit.register '/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  enableConsole: true,
  enableMocks: true
}

# apiKit.get('/teams/{teamId}', function (req, res){})

unless module.parent
  app.listen app.get('port')
  console.log 'listening on port 3000'
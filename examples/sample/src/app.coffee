express = require('express')
http = require('http')
path = require('path')
simplyLog = require 'simply-log'
utils = require 'express/lib/utils'
validations = require('apikit-node').validations

app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.bodyParser())
app.use(express.methodOverride())

app.use validations("../leagues/leagues.raml", app.routes)

app.get('/teams/:teamId', (req, res) =>
  res.send({ name: 'test' })
)

app.get('/teams', (req, res) =>
  res.send({ name: 'test' })
)

app.post('/teams', (req, res) =>
  res.status('201')
)

http.createServer(app).listen(app.get('port'), () ->
  console.log('Express server listening on port ' + app.get('port'))
)




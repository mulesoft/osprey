express = require 'express'
path = require 'path'
osprey = require '../../../src/lib'
xmlparser = require 'express-xml-bodyparser'

app = express()

app.use xmlparser()
app.use express.json()
app.use express.urlencoded()

api = osprey.create '/api', app,
  ramlFile: path.join(__dirname, 'api.raml')
  enableMocks: true
  enableValidations: true
  enableConsole: false
  logLevel: 'off'

module.exports = app

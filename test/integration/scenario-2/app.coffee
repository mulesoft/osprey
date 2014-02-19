express = require 'express'
path = require 'path'
osprey = require '../../../src/lib'

app = express()

app.use express.bodyParser()

api = osprey.create '/api', app,
  ramlFile: path.join(__dirname, 'api.raml')
  enableMocks: true
  enableValidations: true
  enableConsole: false
  logLevel: 'off'

module.exports = app
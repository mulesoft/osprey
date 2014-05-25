express = require 'express'
path = require 'path'
osprey = require '../../../src/lib'

app1 = express()
app2 = express()

app1.use express.json()
app1.use express.urlencoded()
app1.use '/app2', app2

api = osprey.create '/api', app1,
  ramlFile: path.join(__dirname, 'api.raml')
  enableMocks: true
  enableValidations: false
  enableConsole: true
  logLevel: 'off'

api.describe (osprey) ->
  osprey.get '/miscellaneous', (req, res) ->
    throw new Error()

osprey.create '/api', app2,
  ramlFile: path.join(__dirname, 'api.raml')
  enableMocks: true
  enableValidations: false
  enableConsole: true
  logLevel: 'off'

module.exports = app1

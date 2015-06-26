var http = require('http')
var osprey = require('../..')
var finalhandler = require('finalhandler')
var join = require('path').join

var PORT = process.env.PORT || 3000

osprey.loadFile(join(__dirname, 'api.raml'))
  .then(function (middleware) {
    var app = http.createServer(function (req, res) {
      middleware(req, res, finalhandler(req, res))
    })

    app.listen(PORT, function () {
      console.log('Application listening on ' + PORT + '...')
    })
  })

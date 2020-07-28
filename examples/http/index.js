const http = require('http')
const osprey = require('../..')
const finalhandler = require('finalhandler')
const join = require('path').join

const PORT = process.env.PORT || 3000

osprey.loadFile(join(__dirname, 'api.raml'))
  .then(function (middleware) {
    const app = http.createServer(function (req, res) {
      middleware(req, res, finalhandler(req, res))
    })

    app.listen(PORT, function () {
      console.log('Application listening on ' + PORT + '...')
    })
  })

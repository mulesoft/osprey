var express = require('express')
var osprey = require('../..')
var join = require('path').join

var PORT = process.env.PORT || 3000

var router = osprey.Router()

router.get('/users', function (req, res) {
  res.json([
    {
      username: 'blakeembrey',
      password: 'hunter2'
    }
  ])
})

osprey.loadFile(join(__dirname, 'api.raml'))
  .then(function (middleware) {
    var app = express()

    app.use('/v1', middleware, router)

    app.listen(PORT, function () {
      console.log('Application listening on ' + PORT + '...')
    })
  })

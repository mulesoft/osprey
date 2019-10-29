const express = require('express')
const osprey = require('../..')
const join = require('path').join

const PORT = process.env.PORT || 3000

const router = osprey.Router()

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
    const app = express()

    app.use('/v1', middleware, router)

    app.listen(PORT, function () {
      console.log('Application listening on ' + PORT + '...')
    })
  })

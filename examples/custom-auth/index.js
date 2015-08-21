var http = require('http')
var osprey = require('../..')
var finalhandler = require('finalhandler')
var createError = require('http-errors')
var join = require('path').join

var PORT = process.env.PORT || 3000

// Create a custom authentication handler to force users to give me a token.
function handler () {
  return function (req, res, next) {
    if (!req.headers.token) {
      return next(createError(401, 'No token'))
    }

    // Check with the database and see if the token is valid.
    setTimeout(function () {
      return next()
    }, 1000)
  }
}

osprey.loadFile(join(__dirname, 'api.raml'), {
  security: {
    token_auth: function () {
      return { handler: handler }
    }
  }
})
  .then(function (middleware) {
    var router = osprey.Router()

    router.use(middleware)

    router.get('/posts', function (req, res) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end('[]')
    })

    var app = http.createServer(function (req, res) {
      router(req, res, finalhandler(req, res))
    })

    app.listen(PORT, function () {
      console.log('Application listening on ' + PORT + '...')
    })
  })

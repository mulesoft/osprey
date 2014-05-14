var express     = require('express');
var path        = require('path');
var osprey      = require('osprey');
var CustomError = require('./exceptions/custom-error');
var app         = module.exports = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger('dev'));
app.set('port', process.env.PORT || 3000);

var api = osprey.create('/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  logLevel: 'debug',
  enableMocks: true,
  exceptionHandler: {
    InvalidUriParameterError: function (err, req, res) {
      res.send(400);
    },
    CustomError: function (err, req, res) {
      console.log('Custom Error');
      res.send(400);
    }
  }
});

api.describe(function (api) {
  api.get('/teams/:teamId', function (req, res) {
    res.send({ name: 'test' });
  });

  api.get('/teams', function (req, res) {
    throw new CustomError('some exception');
  });

  api.get('/teamss', function (req, res) {
    res.send(200);
  });
})
.then(function (app) {
  if (!module.parent) {
    var port = app.get('port');
    app.listen(port);
    console.log('listening on port ' + port);
  }
});

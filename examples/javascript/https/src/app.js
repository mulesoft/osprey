var express = require('express');
var path    = require('path');
var osprey  = require('osprey');
var https   = require('https');
var fs      = require('fs');
var path    = require('path');
var app     = module.exports = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger('dev'));
app.set('port', process.env.PORT || 3000);

// WARNING: You have to create your own certificates
var privateKey  = fs.readFileSync(path.join(__dirname, '/assets/ssl/server.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, '/assets/ssl/server.crt'), 'utf8');
var credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: 'osprey'
};

var api = osprey.create('/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  logLevel: 'debug'
});

api.describe(function (api) {
  api.get('/teams/:teamId', function (req, res) {
    res.send({ name: 'test' });
  });
})
.then(function (app) {
  if (!module.parent) {
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port);
    console.log('listening on port ' + port);
  }
});

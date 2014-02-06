(function() {
  var api, app, express, osprey, path, port;

  express = require('express');

  path = require('path');

  osprey = require('osprey');

  app = module.exports = express();

  app.use(express.bodyParser());

  app.use(express.methodOverride());

  app.use(express.compress());

  app.use(express.logger('dev'));

  app.set('port', process.env.PORT || 3000);

  api = osprey.create('/api', app, {
    ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
    enableConsole: true,
    enableMocks: true,
    enableValidations: true
  });

  if (!module.parent) {
    port = app.get('port');
    app.listen(port);
    console.log("listening on port " + port);
  }

}).call(this);

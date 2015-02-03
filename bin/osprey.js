#!/usr/bin/env node

var osprey = require('../');

var argv = require('yargs')
    .usage(
      'Generate an API proxy from a RAML definition.\n\n' +
      'Usage: $0 -f [file] -a [endpoint] -p [port number]'
    )
    .demand(['a', 'f', 'p'])
    .describe('a', 'Proxy address')
    .describe('f', 'Path to the RAML definition')
    .describe('p', 'Port number to bind the proxy')
    .describe('docs', 'Serve documentation from a path')
    .argv;

// Create the proxy.
osprey(argv.f, {
  documentationPath: argv.docs
}, function (err, app) {
  if (err) {
    console.error(err.toString());

    return process.exit(1);
  }

  var proxy = osprey.createProxy(app, argv.a).listen(argv.p);

  console.log('Osprey is now listening on port ' + proxy.address().port);
});

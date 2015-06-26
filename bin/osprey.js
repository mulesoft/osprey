#!/usr/bin/env node

var osprey = require('../')

var argv = require('yargs')
  .usage(
    'Generate an API proxy from a RAML definition.\n\n' +
    'Usage: $0 -f [file] -a [address] -p [port number]'
)
  .demand(['a', 'f', 'p'])
  .describe('a', 'Proxy endpoint address')
  .describe('f', 'Path to the RAML definition')
  .describe('p', 'Port number to bind the proxy')
  .describe('docs', 'Serve documentation from a path')
  .argv

osprey.loadFile(argv.f)
  .then(function (app) {
    var proxy = osprey.createProxy(app, argv.a).listen(argv.p)

    console.log('Osprey is now listening on port ' + proxy.address().port)
  })

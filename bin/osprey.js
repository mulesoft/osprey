#!/usr/bin/env node

const join = require('path').join
const osprey = require('../')

const argv = require('yargs')
  .usage(
    'Generate an API proxy from a RAML definition.\n\n' +
    'Usage: $0 -f [file] -a [address] -p [port number]'
  )
  .demand(['a', 'f', 'p'])
  .describe('a', 'Proxy endpoint address')
  .describe('f', 'Path to the RAML definition')
  .describe('p', 'Port number to bind the proxy')
  .describe('s', 'Path to a security options file')
  .argv

osprey
  .loadFile(argv.f, {
    security: argv.s ? require(join(process.cwd(), argv.s)) : null
  })
  .then(function (app) {
    const proxy = osprey.proxy(app, argv.a).listen(argv.p)
    console.log('Osprey is now listening on port ' + proxy.address().port)
  })
  .catch(function (err) {
    console.log(err.stack || err.message || err)
  })

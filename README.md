# Osprey

[![NPM version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

**v0.2.0 Beta**

Generate an API proxy from a RAML definition, which can be used locally or globally for validating API requests and responses.

## Features

* Automatic Request Validations
  * Bodies
    * Form data
    * Url Encoded bodies
    * JSON schemas
    * XML schemas
  * Headers
  * Query parameters
* RAML Router
  * Uses [osprey-router](https://github.com/mulesoft-labs/osprey-router) to accept RAML paths
* Integrates with Express-format middleware servers
  * Simple `req`/`res`/`next` middleware format that works with Connect, Express and even `http`
* API documentation
  * Optionally mount API documentation generated from your RAML definition
* Example Responses **Coming soon**
* Error Handling **Coming soon**

## Usage

### Global

Osprey can be used as a proxy with any other API server. Just install the module globally and use the CLI to set up the application endpoint(s) to proxy, as well as the RAML definition to use. Invalid API requests will be blocked before they reach your application server.

```
# Install Osprey as a global node module
npm install osprey -g

# Proxy to an already running application (with optional documentation)
osprey -f api.raml -p 8000 -a localhost:8080 --docs /documentation
```

**Options**

* `-a` Application endpoint address (can be fully qualified URLs) and specify multiple addresses
* `-f` Path to the root RAML definition (E.g. `/path/to/api.raml`)
* `-p` Port number to bind the proxy locally
* `--docs` Optional path to serve API documentation

### Locally

Osprey can also be used as a local node module and is compatible with Express and Connect, as well as plain HTTP. Just require the module locally and generate the middleware from a RAML definition file. It accepts the file location, an options object and a callback that'll receive the middleware.

```js
var osprey = require('osprey');
var express = require('express');
var app = express();

osprey(__dirname + '/api.raml', {
  documentationPath: '/documentation'
}, function (err, middleware) {
  app.use(middleware);

  app.listen(3000);
});
```

**Options**

* `documentationPath` Optional path to serve API documentation

## License

Apache 2.0

[npm-image]: https://img.shields.io/npm/v/osprey.svg?style=flat
[npm-url]: https://npmjs.org/package/osprey
[downloads-image]: https://img.shields.io/npm/dm/osprey.svg?style=flat
[downloads-url]: https://npmjs.org/package/osprey
[travis-image]: https://img.shields.io/travis/mulesoft/osprey.svg?style=flat
[travis-url]: https://travis-ci.org/mulesoft/osprey
[coveralls-image]: https://img.shields.io/coveralls/mulesoft/osprey.svg?style=flat
[coveralls-url]: https://coveralls.io/r/mulesoft/osprey?branch=master

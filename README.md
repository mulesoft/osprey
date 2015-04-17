# Osprey

[![NPM version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

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
* Automatic Request Parameters
  * Default Headers
  * Default Parameters
* RAML Router
  * Uses [osprey-router](https://github.com/mulesoft-labs/osprey-router) to accept RAML paths
* Integrates with Express-format middleware servers
  * Simple `req`/`res`/`next` middleware format that works with Connect, Express and even `http`
* API documentation **Currently disabled**
  * Optionally mount API documentation generated from your RAML definition
* Error Handling **Coming soon**
  * I18n support
  * Map validation paths to readable strings (with i18n support)
* Response Handling (validation and automatic headers) **Coming soon**
  * Validate response bodies against status code definition
  * Automatically fill response headers
* Authentication **Coming soon**
  * OAuth 1.0
  * OAuth 2.0
  * Basic Authentication
  * Custom Authentication Schemes
* [RAML Mock Service](https://github.com/mulesoft-labs/osprey-mock-service)

## Usage

Osprey is built to enforce a documentation-first approach to APIs. It achieves this by:

1. `404`ing on undocumented resources
2. Rejecting invalid requests bodies, headers and query parameters
3. Automatically filling default headers and query parameters
4. Filtering undocumented headers and query parameters
5. Validating API responses **Coming soon**
6. Automatically filling default response headers **Coming soon**

### Global

```
npm install osprey -g
```

Osprey can be used as a proxy with any other API server. Just install the module globally and use the CLI to set up the application endpoint(s) to proxy, as well as the RAML definition to use. Invalid API requests will be blocked before they reach your application server.

```
# Proxy to a running application (with optional documentation)
osprey -f api.raml -p 8000 -a localhost:8080 --docs /documentation
```

**Options**

* `-a` Application endpoint address (can be fully qualified URLs) and specify multiple addresses
* `-f` Path to the root RAML definition (E.g. `/path/to/api.raml`)
* `-p` Port number to bind the proxy locally
* `--docs` Optional path to serve API documentation

### Locally

```
npm install osprey --save
```

Osprey can also be used as a local node module and is compatible with Express and Connect, as well as plain HTTP. Just require the module locally and generate the middleware from a RAML definition file. It accepts the file location, an options object and a callback that'll receive the middleware.

```js
var osprey = require('osprey');
var express = require('express');
var app = express();

osprey.loadFile(__dirname + '/api.raml')
  .then(function (middleware) {
    app.use(middleware);

    app.listen(3000);
  });
```

**Options**

* `documentationPath` Optional path to serve API documentation

#### Handling Requests

Undefined API requests will always be rejected with a 404.

##### Invalid Headers and Query Parameters

Invalid headers and query parameters will be removed from the request. In order to read them, they need to be documented in the RAML definition.

##### Request Bodies

Request bodies are already parsed and validated for you.

For `application/json` and `application/x-www-form-urlencoded`, the data will be an object under `req.body`. For `text/xml`, the body is stored as a string under `req.body` while the parsed XML document is under `req.xml` (uses [LibXMLJS](https://github.com/polotek/libxmljs)). For `multipart/form-data`, you will need to attach field and file listeners to the request form (uses [Busboy](https://github.com/mscdex/busboy)):

```js
app.post('/users/{userId}', function (req, res, next) {
  req.form.on('field', function (name, value) {
    console.log(name + '=' + value);
  });

  req.form.on('file', function (name, stream, filename) {
    stream.pipe(fs.createWriteStream(__dirname + '/../tmp/' + filename));
  });

  req.form.on('error', next);

  req.pipe(req.form);
});
```

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

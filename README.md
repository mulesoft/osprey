# Osprey

[![NPM version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Generate API middleware from a RAML definition, which can be used locally or globally for validating API requests and responses.

## Features

* Automatic Request Validations
  * Bodies
    * Form data
    * Url Encoded bodies
    * JSON schemas
    * XML schemas
  * Headers
  * Query parameters
  * RAML 1.0 types
* Automatic Request Parameters
  * Default Headers
  * Default Parameters
* RAML Router
  * Uses [osprey-router](https://github.com/mulesoft-labs/osprey-router) for RAML paths
* Integrates with Express-format middleware servers
  * Simple `req`/`res`/`next` middleware format that works with Connect, Express and even `http`
* API documentation **Currently disabled**
  * Optionally mount API documentation generated from your RAML definition
* Built-in Error Handling Middleware
  * I18n support
  * Map validation paths to readable strings (with i18n support)
* Built-in Response Handling **Coming soon**
  * Validate response bodies against status code definition
  * Automatically fill default response headers
* Authentication
  * OAuth 1.0 **Coming Soon**
  * OAuth 2.0
  * Basic Authentication
  * Digest Authentication
  * Custom Security Schemes
* [RAML Mock Service](https://github.com/mulesoft-labs/osprey-mock-service)

Osprey is built to enforce a **documentation-first** approach to APIs. It achieves this by:

**Server**

1. `404`ing on undocumented resources
2. Rejecting invalid requests bodies, headers and query parameters
3. Populating default headers and query parameters
4. Filtering undocumented headers and query parameters
5. Validating API responses **Coming soon**
6. Fill default response headers **Coming soon**

**Security**

1. Setting up authentication endpoints and methods for you
2. Authenticating endpoints as defined in RAML

## Installation

### Global

```
npm install osprey -g
```

Osprey can be used as a validation proxy with any other API server. Just install the module globally and use the CLI to set up the application endpoint(s) to proxy, as well as the RAML definition to use. Invalid API requests will be blocked before they reach your application server.

```sh
# Proxy to a running application (with optional documentation)
osprey -f api.raml -p 3000 -a localhost:8080
```

**Options**

* `-a` Application endpoint address (can be fully qualified URLs) and specify multiple, comma-separated addresses
* `-f` Path to the root RAML definition (E.g. `/path/to/api.raml`)
* `-p` Port number to bind the proxy locally

### Locally

```
npm install osprey --save
```

## Usage

Osprey is normally used as a local node module and is compatible with any library supporting HTTP middleware, including Express and Connect. Just require the module locally and generate the middleware from a RAML definition file.

```js
var osprey = require('osprey')
var express = require('express')
var join = require('path').join
var app = express()

var path = join(__dirname, 'assets', 'api.raml')

// Be careful, this uses all middleware functions by default. You might just
// want to use each one separately instead - `osprey.server`, etc.
osprey.loadFile(path)
  .then(function (middleware) {
    app.use(middleware)

    app.use(function (err, req, res, next) {
      // Handle errors.
    })

    app.listen(3000)
  })
   .catch(function(e) { console.error("Error: %s", e.message); });
```

**Please note:** The middleware function does not use the RAML `baseUri`. Make sure you mount the application under the correct path. E.g. `app.use('/v1', middleware)`.

**Please note:** `osprey.loadFile` is shorthand for `ramlParser.loadFile -> [osprey.security, osprey.server, osprey.errorHandler]`.

### Server (Resource Handling)

```js
var handler = osprey.server(raml, options)

console.log(handler) //=> function (req, res, next) {}

console.log(handler.ramlUriParameters) //=> {} // A merged object of used URI parameters.
```

Undefined API requests will _always_ be rejected with a 404.

#### Options

These are also passed along to [osprey-method-handler](https://github.com/mulesoft-labs/osprey-method-handler)).

* **cors** Enable CORS by setting to `true` or an object from [cors](https://github.com/expressjs/cors#configuration-options) (default: `false`)
* **compression** Enable response compression using [compression](https://github.com/expressjs/compression) (default: `false`)
* **notFoundHandler** Use a `404` error in middleware to skip over invalid/undefined routes from RAML (default: `true`)

**From Osprey Method Handler:**

* **discardUnknownBodies** Discard undefined request bodies (default: `true`)
* **discardUnknownQueryParameters** Discard undefined query parameters (default: `true`)
* **discardUnknownHeaders** Discard undefined header parameters (always includes known headers) (default: `true`)
* **parseBodiesOnWildcard** Toggle parsing bodies on wildcard body support (default: `false`)
* **reviver** The reviver passed to JSON.parse for JSON endpoints
* **limit** The maximum bytes for XML, JSON and URL-encoded endpoints (default: `'100kb'`)
* **parameterLimit** The maximum number of URL-encoded parameters (default: `1000`)
* **busboyLimits** The limits for [Busboy](https://github.com/mscdex/busboy#busboy-methods) multipart form parsing

If you disable the default "not found" handler, it should be mounted later using `osprey.server.notFoundHandler`. For example, `app.use(osprey.server.notFoundHandler)`.

#### Invalid Headers and Query Parameters

Invalid headers and query parameters are removed from the request. To read them they need to be documented in the RAML definition.

#### Request Bodies

Request bodies are parsed and validated for you, when you define the schema.

For `application/json` and `application/x-www-form-urlencoded`, the data will be an object under `req.body`. For `text/xml`, the body is stored as a string under `req.body` while the parsed XML document is under `req.xml` (uses [LibXMLJS](https://github.com/polotek/libxmljs), not included). For `multipart/form-data`, you will need to attach field and file listeners to the request form (uses [Busboy](https://github.com/mscdex/busboy)):

```js
app.post('/users/{userId}', function (req, res, next) {
  req.form.on('field', function (name, value) {
    console.log(name + '=' + value)
  })

  req.form.on('file', function (name, stream, filename) {
    stream.pipe(fs.createWriteStream(join(os.tmpDir(), filename)))
  })

  req.form.on('error', next)

  req.pipe(req.form)
})
```

#### Headers, Parameters and Query Parameters

All parameters are automatically validated and parsed to the correct types according to the RAML document using [raml-validate](https://github.com/mulesoft/node-raml-validate) and [raml-sanitize](https://github.com/mulesoft/node-raml-sanitize). URL parameter validation comes with [Osprey Router](https://github.com/mulesoft-labs/osprey-router), available using `osprey.Router`.

```js
// Similar to `express.Router`, but uses RAML paths.
var Router = require('osprey').Router

var app = new Router()

app.use(...)

app.get('/{slug}', {
  slug: {
    type: 'string'
  }
}, function (req, res) {
  res.send('success')
})

module.exports = app
```

You can initialize a `Router` with `ramlUriParameters`. This is helpful, since every router collects an object with merged URI parameters. For example, you can combine it with the `server` middleware to generate a router with your RAML URI parameters:

```js
var handler = osprey.server(raml)
var router = osprey.Router({ ramlUriParameters: handler.ramlUriParameters })

// Uses an existing `userId` URI parameter, if it exists.
router.get('/{userId}', function (req, res, next) {})
```

#### Handling Errors

Osprey returns a [middleware router instance](https://github.com/pillarjs/router), so you can mount this within any compatible application and handle errors with the framework. For example, using HTTP with [finalhandler](https://github.com/pillarjs/finalhandler) (the same module Express uses):

```js
var http = require('http')
var osprey = require('osprey')
var finalhandler = require('finalhandler')
var join = require('path').join

osprey.loadFile(join(__dirname, 'api.raml'))
  .then(function (middleware) {
    http.createServer(function (req, res) {
      middleware(req, res, finalhandler(req, res))
    }).listen(process.env.PORT || 3000)
  })
   .catch(function(e) { console.error("Error: %s", e.message); });
```

**Error Types**

* `error.ramlAuthorization = true` An unauthorized error containing an array of errors that occured is set on `error.authorizationErrors`
* `error.ramlValidation = true` A request failed validation and an array of validation data is set on `error.requestErrors` (beware, different types contain different information)
* `error.ramlNotFound = true` A request 404'd because it was not specified in the RAML definition for the API

#### Add JSON Schemas

JSON schemas can be added to the application for when external JSON references are needed. From [osprey-method-handler](https://github.com/mulesoft-labs/osprey-method-handler#adding-json-schemas).

```js
osprey.addJsonSchema(schema, key)
```

### Error Handler

**Osprey** comes with support for a built-in [error handler middleware](https://github.com/mulesoft-labs/node-request-error-handler) that formats request errors for APIs. It comes with built-in i18n with some languages already included for certain formats ([_help us add more!_](https://github.com/mulesoft-labs/node-request-error-handler/pulls)). The default fallback language is `en` and the default responder renders JSON, XML, HTML and plain text - all options are overridable.

```js
var osprey = require('osprey')
var app = require('express')()

// It's best to use the default responder, but it's overridable if you need it.
app.use(osprey.errorHandler(function (req, res, errors, stack) { /* Override */ }, 'en'))
```

You can override the i18n messages or provide your own by passing a nested object that conforms to the following interface:

```js
interface CustomMessages {
  [type: string]: {
    [keyword: string]: {
      [language: string]: (error: RequestError) => string
    }
  }
}
```

The request error interface is as follows:

```js
interface RequestError {
  type: 'json' | 'form' | 'headers' | 'query' | 'xml' | string
  message: string /* Merged with i18n when available */
  keyword: string /* Keyword that failed validation */
  id?: string /* A unique identifier for the instance of this error */
  dataPath?: string /* Natural path to the error message (E.g. JSON Pointers when using JSON) */
  data?: any /* The data that failed validation */
  schema?: any /* The schema value that failed validation */
  detail?: string /* Additional details about this specific error instance */
  meta?: { [name: string]: string } /* Meta data from the error (XML validation provides a code, column, etc.) */
}
```

**Want to format your own request errors?** If you emit an error with a `.status` property of "client error" (`400` - `499`) and an array of `requestErrors`, it will automatically be rendered as the API response (using `status` as the response status code).

### Security

```js
osprey.security(raml, options)
```

Osprey accepts an options object that maps object keys to the security scheme name in the RAML definition.

#### OAuth 2.0

Provided by [OAuth2orize](https://github.com/jaredhanson/oauth2orize) and [Passport](https://github.com/jaredhanson/passport).

```raml
securitySchemes:
  - oauth_2_0:
      type: OAuth 2.0
      settings:
        authorizationUri: https://example.com/oauth/authorize
        accessTokenUri: https://example.com/oauth/token
        authorizationGrants: [ code, token, owner, credentials ]
        scopes:
          - profile
          - history
          - history_lite
          - request
          - request_receipt
```

OAuth 2.0 can be fairly tricky to enforce on your own. With **Osprey**, any endpoint with `securedBy` will automatically be enforced.

**Required Options (by grant type)**

- **All**
  - `authenticateClient`
  - `exchange.refresh` **When refresh tokens are used**

- **Code** and **Token**
  - `serializeClient`
  - `deserializeClient`
  - `authorizeClient`
  - `sessionKeys`
  - `ensureLoggedIn` **Has access to `req.session`**
  - `serveAuthorizationPage` **Has access to `req.session`**

- **Code**
  - `grant.code`
  - `exchange.code`

- **Token**
  - `grant.token`

- **Credentials**
  - `exchange.credentials`

- **Owner**
  - `exchange.owner`

The authorization page must submit a POST request to the same URL with the `transaction_id` and `scope` properties set (from `req.oauth2`). If the dialog was denied, submit `cancel=true` with the POST body. If you wish to enable the ability to skip the authorization page (E.g. user already authorized or first-class client), use the `immediateAuthorization` option.

```js
osprey.security(raml, {
  oauth_2_0: {
    // Optionally override `accessTokenUri` and `authorizationUri` when needed.
    // They need to match the suffix defined in the security scheme.
    accessTokenUri: '/oauth/token',
    authorizationUri: '/oauth/authorize',
    // Serialize the client object into the session.
    serializeClient: function (application, done) {
      return done(null, application.id)
    },
    // Deserialize client objects out of the session.
    deserializeClient: function (id, done) {
      Client.findById(id, function (err, client) {
        done(err, client)
      })
    },
    authorizeClient: function (clientId, redirectUri, scope, type, done) {
      Clients.findOne(clientId, function (err, client) {
        if (err) { return done(err) }
        if (!client) { return done(null, false) }
        if (!client.redirectUri != redirectUri) { return done(null, false) }
        return done(null, client, client.redirectUri)
      })
    },
    authenticateClient: function (clientId, clientSecret, done) {
      Clients.findOne({ clientId: clientId }, function (err, client) {
        if (err) { return done(err) }
        if (!client) { return done(null, false) }
        if (client.clientSecret != clientSecret) { return done(null, false) }
        return done(null, client)
      })
    },
    findUserByToken: function (token, done) {
      User.findOne({ token: token }, function (err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false) }
        return done(null, user, { scope: 'all' })
      })
    },
    // An array of unique session keys to sign and verify cookies.
    sessionKeys: ['a', 'b', 'c', ...],
    ensureLoggedIn: function (req, res, next) {
      // For example: https://github.com/jaredhanson/connect-ensure-login
    },
    immediateAuthorization: function (client, user, scope, done) {
      return done(null, false)
    },
    serveAuthorizationPage: function (req, res) {
      res.render('dialog', {
        transactionId: req.oauth2.transactionID,
        user: req.user,
        client: req.oauth2.client
      })
    },
    grant: {
      code: function (client, redirectUri, user, ares, done) {
        AuthorizationCode.create(client.id, redirectUri, user.id, ares.scope, function (err, code) {
          if (err) { return done(err) }
          done(null, code)
        })
      },
      token: function (client, user, ares, done) {
        AccessToken.create(client, user, ares.scope, function (err, accessToken) {
          if (err) { return done(err) }
          done(null, accessToken /*, params */)
        })
      }
    },
    exchange: {
      code: function (client, code, redirectUri, done) {
        AccessToken.create(client, code, redirectUri, function (err, accessToken) {
          if (err) { return done(err) }
          done(null, accessToken /*, refreshToken, params */)
        })
      },
      credentials: function (client, scope, done) {
        AccessToken.create(client, scope, function (err, accessToken) {
          if (err) { return done(err) }
          done(null, accessToken /*, refreshToken, params */)
        })
      },
      owner: function (client, username, password, scope, done) {
        AccessToken.create(client, username, password, scope, function (err, accessToken) {
          if (err) { return done(err) }
          done(null, accessToken /*, refreshToken, params */)
        })
      },
      refresh: function (client, refreshToken, scope, done) {
        AccessToken.create(client, refreshToken, scope, function (err, accessToken) {
          if (err) { return done(err) }
          done(null, accessToken /*, refreshToken, params */)
        })
      }
    }
  }
})
```

**Osprey** will automatically block requests with invalid scopes, when defined in RAML using the [inline option](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#usage-applying-a-security-scheme-to-an-api) syntax.

```raml
/example:
  securedBy: [oauth_2_0: { scopes: [ ADMINISTRATOR ] } ]
```

To implement scope validation in your own application, without RAML, use `osprey.security.scope('example')` and users without the required scope will be rejected.

```js
app.get('/foo/bar', osprey.security.scope('example'), function (req, res) {
  res.send('hello, world')
})
```

**Please note:** OAuth 2.0 does not (currently) take into account security scheme `describedBy` of specification.

#### OAuth 1.0

Coming soon...

#### Basic Authentication

Provided by [Passport-HTTP](https://github.com/jaredhanson/passport-http).

```raml
securitySchemes:
  - basic_auth:
      type: Basic Authentication
```

```js
osprey.security(raml, {
  basic_auth: {
    realm: 'Users', // Optional.
    validateUser: function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false) }
        if (!user.verifyPassword(password)) { return done(null, false) }
        return done(null, user)
      })
    }
  }
})
```

#### Digest Authentication

Provided by [Passport-HTTP](https://github.com/jaredhanson/passport-http).

```raml
securitySchemes:
  - digest_auth:
      type: Digest Authentication
```

```js
osprey.security(raml, {
  digest_auth: {
    realm: 'Users', // Optional.
    domain: 'example.com', // Optional.
    findUserByUsername: function (username, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false) }
        return done(null, user, user.password)
      })
    }
  }
})
```

#### Custom Security Schemes

To register a custom security scheme, you can pass in your own function.

```raml
securitySchemes:
  - custom_auth:
      type: x-custom
```

The function must return an object with a handler and, optionally, a router. The router will be mounted immediately and the handler will be called on every secured route with the secured by options and the RAML path.

```js
osprey.security(raml, {
  custom_auth: function (scheme, name) {
    return {
      handler: function (options, path) {
        return function (req, res, next) {
          return next()
        }
      },
      router: function (req, res, next) {
        return next()
      }
    }
  }
})
```

### Proxy

```js
osprey.proxy(middleware, addresses)
```

Pass in an Osprey middleware function with an array of addresses to proxy to and you have a fully-functioning validation and/or security proxy.

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

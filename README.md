Osprey
======

A [Node JS](http://nodejs.org/) binding for [RAML](raml.org).

### Prerequisites

To start using Osprey you'll need the following:

* [Node JS](http://nodejs.org/)
* [NPM](https://npmjs.org/)

### Getting started

`npm install git+https://github.com/mulesoft/osprey.git`

Optionally, you can use [Bower](http://bower.io/) - `bower install git@github.com:mulesoft/osprey.git`

### Initializing Osprey
You can intialize Osprey as follow:
```javascript

api = osprey.create('/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  enableConsole: true,
  enableMocks: true,
  enableValidations: true,
  logLevel: 'debug'
});
```
#####Options
* `/api` represents the basePath of the API
* `app` represents the reference of an express App

#####Parameters
| Name         | Default Value  | Description  |
|:------------------|:---------------|:---------------|
| ramlFile          | null           | Indicates where the RAML file is being stored|
| enableConsole     | true           | Enables or disables the [API console](https://github.com/mulesoft/api-console) |
| consolePath       | /console       | Defines the url for the API-console relative to the apiPath |
| enableMocks       | true           | Enables or disables the mocks routes |
| enableValidations | true           | Enables or disables the validations |
| exceptionHandler  | {}             | Gives you the possibility to reuse exception handlers|
| logLevel          | off            | Sets the logging level. ['off', 'info', 'debug'] |

### Registering resources
Register a resource is as easy as follow:
```javascript
api.get('/teams/:teamId', function(req, res) {
  //// Your business logic here!
  res.send({ name: 'test' })
});
```

`osprey.get` is always relative to the basePath defined in `osprey.create`.

#####Other supported methods

* api.get
* api.post
* api.put
* api.delete
* api.head
* api.patch

### Exception Handling

Osprey gives you the posibility to handle exceptions in a very reusable way.

First you have to setup the exceptionHandler module.

```javascript
api = osprey.create('/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  exceptionHandler: {
    InvalidUriParameterError: (err, req, res) ->
      // Overwriting the default implementation
      res.send 400
    CustomError: (err, req, res) ->
      //// Do something here!
      res.send 400
  }
});
```

If a resource throws an error of type CustomError, the exception handler module will handle it.

```javascript
api.get('/teams', function (req, res) {
  throw new CustomError 'some exception'
});
```
##### Default Errors
| Name                       | HTTP Status| Description  |
|:---------------------------|:----|:---------------|
| InvalidAcceptTypeError     | 406 | It will be thrown when the Accept type is not supported by the API |
| InvalidContentTypeError    | 415 | It will be thrown when the Content type is not supported by the API |
| InvalidUriParameterError   | 400 | It will be thrown if a URI parameter is invalid according to the validation rules |
| InvalidFormParameterError  | 400 | It will be thrown if a Form parameter is invalid according to the validation rules |
| InvalidQueryParameterError | 400 | It will be thrown if a Query parameter is invalid according to the validation rules |
| InvalidHeaderError         | 400 | It will be thrown if a Header is invalid according to the validation rules |
| InvalidBodyError           | 400 | It will be thrown if a body is invalid according to the validation schemas |

### Validations

You can enable or disable validations by using the option `enableValidations` in `osprey.create`. 

##### Supported Validations

* Form Parameters
* Query Parameters
* URI Parameters
* Headers
* JSON Schema
* XML Schema

###### Notes

In order to support XML schema validation, you have to setup the following middleware in your application
[express-xml-bodyparser](https://www.npmjs.org/package/express-xml-bodyparser).

### Example
```javascript
  var express = require('express');
  var path = require('path');
  var osprey = require('osprey');

  var app = module.exports = express()

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());
  app.use(express.logger('dev'));
  
  app.set('port', process.env.PORT || 3000));

  var api = osprey.create('/api', app, {
    ramlFile: path.join(__dirname, '/assets/raml/api.raml')
  });
  
  api.get('/resource', function(req, res) {
    //// Your business logic here!
  });

  if (!module.parent) {
    var port = app.get('port');
    app.listen(port);
    console.log('listening on port ' + port);
  }
```

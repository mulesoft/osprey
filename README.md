Osprey
======

A [Node JS](http://nodejs.org/) binding for [RAML](raml.org).

### Prerequisites

To start using Osprey you'll need the following:

* [Node JS](http://nodejs.org/)
* [NPM](https://npmjs.org/)
* [Grunt](http://gruntjs.com/)

### Getting started

1. Clone Osprey - `git clone git@github.com:mulesoft/osprey.git`
2. Install Osprey in your project - `npm install /Users/{username}/Projects/osprey`

Optionally, you can use [Bower](http://bower.io/) - `bower install git@github.com:mulesoft/osprey.git`

### Initializing Osprey
You can intialize Osprey as follow:
```javascript

api = osprey.create('/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  enableConsole: true,
  enableMocks: true,
  enableValidations: true
});
```
#####Options
* `/api` represents the basePath of the API
* `app` represents the reference of an express App

#####Parameters
| Name         | Default Value  | Description  |
|:------------------|:---------------|:---------------|
| ramlFile          | null           | Indicates where the RAML file is being stored|
| enableConsole     | true           | Enables or disables the API console |
| enableMocks       | true           | Enables or disables the mocks routes |
| enableValidations | true           | Enables or disables the validations |
| exceptionHandler  | {}             | Gives you the possibility to resuse exception handlers|

### Registering resources
Register a resource is as easy as follow:
```javascript
api.get('/teams/:teamId', function(req, res) {
  //// Your business logic here!
  res.send({ name: 'test' })
});
```

osprey.get is always relative to the basePath defined in osprey.register.

#####Other supported methods

* api.get
* api.post
* api.put
* api.delete
* api.head
* api.patch

### Exception Handling

APIKit gives you the posibility to handle exceptions in a very reusable way.

First you have to setup the exceptionHandler module.

```javascript
api = osprey.create('/api', app, {
  ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
  exceptionHandler: {
    Error: (err, req, res) ->
      //// Do something here!
      res.send 400
  }
});
```

If a resource throws an error of type Error, the exception handler module will handle it.

```javascript
api.get('/teams', function (req, res) {
  throw new Error 'some exception'
});
```

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

Osprey
======

A [Node JS](http://nodejs.org/) binding for [RAML](raml.org).

### Prerequisites

To start using APIKit you'll need the following:

* [Node JS](http://nodejs.org/)
* [NPM](https://npmjs.org/)
* [Grunt](http://gruntjs.com/)

### Getting started

1. Clone APIKit - `git clone git@github.com:mulesoft/apikit-node.git`
2. Install APIKit in your project - `npm install /Users/{username}/Projects/apikit-node`

Optionally, you can use [Bower](http://bower.io/) - `bower install git@github.com:mulesoft/apikit-node.git`

### Initializing APIKit
You can intialize APIKit as follow:
```javascript
api = apiKit.create('/api', app, {
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

### Registering resources
Register a resource is as easy as follow:
```javascript
api.get('/teams/:teamId', function(req, res) {
  //// Your business logic here!
  res.send({ name: 'test' })
});
```

apiKit.get is always relative to the basePath defined in apiKit.register.

#####Other supported methods

* api.get
* api.post
* api.put
* api.delete
* api.head
* api.patch

### Example
```javascript
  var express = require('express');
  var path = require('path');
  var apiKit = require('apikit-node');

  var app = module.exports = express()

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());
  app.use(express.logger('dev'));
  
  app.set('port', process.env.PORT || 3000));

  var api = apiKit.create('/api', app, {
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

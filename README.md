APIKit for Node
===============

### Prerequisites

To start using APIKit you'll need the following:

* [Node JS](http://nodejs.org/)
* [NPM](https://npmjs.org/)
* [Grunt](http://gruntjs.com/)

### Getting started

1. Clone APIKit - `git clone git@github.com:mulesoft/apikit-node.git`
2. Install APIKit in your project - `npm install /Users/{username}/Projects/apikit-node`

Note: The npm package will be available in a near future.

### APIKit Register options

| Parameter         | Default Value  | Description  |
|:------------------|:---------------|:---------------|
| ramlFile          | null           | Indicates where the RAML file is.|
| enableConsole     | true           | Enables or disables the API console |
| enableMocks       | true           | Enables or disables the mocks routes |
| enableValidations | true           | Enables or disables the validations |

### Registering resources

Register a resource is as easy as follows:

```javascript
apiKit.get('/teams/:teamId', function(req, res) {
  //// Your business logic here!
  res.send({ name: 'test' })
});
```

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

  apiKit.register('/api', app, {
    ramlFile: path.join(__dirname, '/assets/raml/api.raml'),
    enableConsole: true,
    enableMocks: true,
    enableValidations: true
  });

  if (!module.parent) {
    app.listen(app.get('port'));
    console.log('listening on port 3000');
  }
```

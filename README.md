Osprey
======

Osprey is a JavaScript framework, based on [Node](http://nodejs.org/) and [Express](http://expressjs.com/), for rapidly building applications that expose APIs described via [RAML](http://raml.org), the RESTful API Modeling Language. Along with its [companion CLI project](https://github.com/mulesoft/osprey-cli), Osprey takes an API-first approach: the RAML API defines the contract between the applicatiorn and its consumers, which Osprey helps enforce and implement, together with its CLI.

### Important
The current release of Osprey is very much a work in progress. As it is in active use within a number of rapid development projects, it too is evolving with the needs those projects uncover. While it is proving extremely beneficial, because it's still evolving rapidly we don't yet feel it meets our criteria for a first fully stable release.

**We encourage you to use it and participate by raising issues, providing feedback or contributing your own code (see below)**

### Coming Soon
Please check the  [Osprey 1.0 Milestone](https://github.com/mulesoft/osprey/issues?milestone=1&state=open) issues list to stay up-to-date with the immediate roadmap.

### Fundamentals
Major features include:
- Automatic Validations:
  - Form, URI, and query parameters
  - Headers
  - JSON and XML schemas
- Default parameters
- Exception handling
- Auto-generated mocks for the APIs your application exposes, as long as you define sample responses in the RAML file.
- [API Console](https://github.com/mulesoft/api-console): Auto-generated documentation displayed on an interactive web application, allowing the developer to easily invoke the APIs.

### Related projects
Check out [Osprey-CLI](https://github.com/mulesoft/osprey-cli), the scaffolding tool that generates Osprey-based applications from a RAML spec with just a single command.

### Contributing
If you are interested in contributing some code to this project, thanks! Please submit a [Contributors Agreement](https://api-notebook.anypoint.mulesoft.com/notebooks#bc1cf75a0284268407e4) acknowledging that you are transferring ownership.

To discuss this project, please use its github issues or the [RAML forum](http://forums.raml.org/).

### Prerequisites

To start using Osprey you'll need the following:

* [Node JS](http://nodejs.org/)
* [NPM](https://npmjs.org/)

### Getting started

`npm install osprey`

Note: You can ignore warnings appearing during osprey installation. Most of these are thrown by libraries being used. You can always review the warnings in case the installation is not successful.

#### Option A (Recommended)

1. Scaffold a new application by using the [Osprey-CLI](https://github.com/mulesoft/osprey-cli). You'll define an `[output folder]` there.
2. Check the resulting directories structure.
```
 [output folder]
    |--Gruntfile.js
    |--package.json
    |--src
    |  |--app.js
    |  |--assets
    |   |--raml
    |     |--api.raml
    |-test  
```
  - Get familiar with the basic structure
  - Notice the `[output folder]/src/assets/raml` folder. If you specified an existing RAML file, or folder containing RAML definitions, those will be copied here.
  If not, you will find an empty RAML file named `api.raml`
  - Also notice `[output folder]/src/app.js`. This is the main application file. Here you will start registering your resources and coding your logic (or routing to it).
3. If you are working with an empty RAML file, you need to start capturing your API spec in it. The RAML file describes your API and is used by Osprey to match with resources registered on `app.js`, validate, etc.
4. Edit `/[output_folder]/src/app.js` to start registering resources ([check this out under the "Key Concepts"](https://github.com/mulesoft/osprey/edit/master/README.md#resources-registration) section in this readme).

#### Option B
You can check the [example](https://github.com/mulesoft/osprey/tree/master/examples) included with Osprey to see a fully functional application, and then create one by following the same patterns.

#### Run your Osprey application
From your terminal run:
`grunt` (recommended: It will set up the proper listeners so changes in the code are automatically refreshed in runtime).

**OR** you can always run: `node src/app.js`

##### Accessing the API Console
Open a browser and navigate to http://localhost:3000/api/console/ to display the API Console.

### Key Concepts
Note that you first need to create an Express app before initializing Osprey. This is taken care of automatically by Osprey CLI, or you can just refer to the examples.

#### Osprey Initialization
```javascript

api = osprey.create('/api', app, {
  logLevel: 'debug'
});
```
##### Arguments
* `/api` is the basePath where you'd like to host the API
* `app` is your Express App
* the third argument is an optional settings object:

| Option name       | Default Value  | Description  |
|:------------------|:---------------|:---------------|
| ramlFile          | process.cwd() + '/src/assets/raml/api.raml' | Where the RAML file is being stored |
| enableConsole     | true           | Enables the embedded [API console](https://github.com/mulesoft/api-console) |
| consolePath       | /console       | Defines the url for the API console relative to the apiPath |
| enableMocks       | true           | Enables the mocking capability |
| enableValidations | true           | Enables validation |
| exceptionHandler  | {}             | Registers exception handlers |
| logLevel          | off            | Sets the logging level: one of ['off', 'info', 'debug'] |

#### Resources registration
Each resource in the API must be registered as follows:
```javascript
api.get('/teams/:teamId', function(req, res) {
  // Your business logic here!
  // E.g.:
  res.send({ name: 'test' });
});
```

The path indicated by the first argument to `api.get`, `api.post`, etc. is always relative to the `basePath` defined in `api.create`.

##### Other supported methods

* api.get
* api.post
* api.put
* api.delete
* api.head
* api.patch

#### Exception Handling

Osprey allows handling exceptions in a very reusable way.

First you have to setup the exceptionHandler module:
```javascript
api = osprey.create('/api', app, {
  exceptionHandler: {
    InvalidUriParameterError: function (err, req, res) {
      // Overwriting the default implementation
      res.send (400);
    },
    CustomError: function (err, req, res) {
      // Do something here!
      res.send (400);
    }
  }
});
```

If a resource throws an error of type CustomError, the exception handler module will handle it.

```javascript
api.get('/teams', function (req, res) {
  throw new CustomError('some exception');
});
```

##### Default Errors
| Name                       | HTTP Status| Description  |
|:---------------------------|:----|:---------------|
| InvalidAcceptTypeError     | 406 | When the type in the Accept header is not supported by the API |
| InvalidContentTypeError    | 415 | When the type in the Content-Type header is not supported by the API |
| InvalidUriParameterError   | 400 | When a URI parameter is invalid according to the validation rules |
| InvalidFormParameterError  | 400 | When a form parameter is invalid according to the validation rules |
| InvalidQueryParameterError | 400 | When a query parameter is invalid according to the validation rules |
| InvalidHeaderError         | 400 | When a request header is invalid according to the validation rules |
| InvalidBodyError           | 400 | When a request body is invalid according to the validation schemas |

#### Validations

You can enable or disable validations by using the option `enableValidations` in `osprey.create`.

##### Supported Validations

* URI parameters
* Query parameters
* Form parameters
* Headers
* JSON Schema
* XML Schema

###### Notes

In order to support XML schema validation, you need to setup [express-xml-bodyparser](https://www.npmjs.org/package/express-xml-bodyparser) middleware in your application:
1. Add the dependency into the `package.json`:
```
"dependencies": {
    ...,
    "express-xml-bodyparser": "0.0.4"
  },
```

2. Import the module: `var xmlparser = require('express-xml-bodyparser');`
3. Indicate you application will be using it: `app.use(xmlparser()); `

#### Example

```javascript
  var express   = require('express');
  var path      = require('path');
  var osprey    = require('osprey');
  var app       = module.exports = express()
  var xmlparser = require('express-xml-bodyparser'); // Only if XML Schema validations are needed

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.logger('dev'));
  app.use(xmlparser()); // Only if XML Schema validations are needed

  app.set('port', process.env.PORT || 3000));

  var api = osprey.create('/api', app);

  api.get('/resource', function(req, res) {
    // Your business logic here!
  });

  if (!module.parent) {
    var port = app.get('port');
    app.listen(port);
    console.log('listening on port ' + port);
  }
```

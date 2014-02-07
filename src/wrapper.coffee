ramlParser = require 'raml-parser'
async = require 'async'
winston = require 'winston'
colors = require 'colors'

colors.setTheme
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'

logger = new(winston.Logger)({
  transports: [
      new(winston.transports.Console)(
        colorize: true
      )
  ],
  levels: {
    info: 2,
    Osprey: 3
  },
  colors: {
    Osprey: 'cyan'
  }
})

class ParserWrapper
  constructor: (data)->
    @raml = data
    @resources = {}
    @_generateResources()

  getResources: ->
    @resources

  getUriTemplates: ->
    templates = []

    for key,resource of @resources
      templates.push { uriTemplate: key }

    templates

  getResourcesList: ->
    resourceList = []
    for key,resource of @resources
      resourceCopy = clone resource
      resourceCopy.uri = key
      resourceList.push resourceCopy
    resourceList

  getProtocols: ->
    @raml.protocols

  getSecuritySchemes: ->
    @raml.securitySchemes

  getRaml: ->
    @raml

  _generateResources: ->
    @_processResource x, @resources for x in @raml.resources

  _processResource: (resource, resourceMap, uri) ->
    if not uri?
      uri = resource.relativeUri

    if resource.resources?
      this._processResource x, resourceMap, uri + x.relativeUri for x in resource.resources

    uriKey = uri.replace /{(.*?)}/g,":$1"
    resourceMap[uriKey] = clone resource
    delete resourceMap[uriKey].relativeUri
    delete resourceMap[uriKey]?.resources

clone = (obj) ->
  if not obj? or typeof obj isnt 'object'
    return obj

  if obj instanceof Date
    return new Date(obj.getTime())

  if obj instanceof RegExp
    flags = ''
    flags += 'g' if obj.global?
    flags += 'i' if obj.ignoreCase?
    flags += 'm' if obj.multiline?
    flags += 'y' if obj.sticky?
    return new RegExp(obj.source, flags)

  newInstance = new obj.constructor()

  for key of obj
    newInstance[key] = clone obj[key]

  return newInstance

ramlLoader = (filePath, callback) ->
  ramlParser.loadFile(filePath).then(
    (data) ->
      logger.log 'Osprey', 'RAML successfully loaded'.info
      callback(new ParserWrapper data)
    ,(error) ->
      logger.log 'Osprey', "Error when parsing RAML. Message: #{error.message}, Line: #{error.problem_mark.line}, Column: #{error.problem_mark.column}".error
  )

exports.loadRaml = async.memoize ramlLoader

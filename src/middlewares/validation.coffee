SchemaValidator = require('jsonschema').Validator
InvalidUriParameterError = require '../errors/invalid-uri-parameter-error'
InvalidFormParameterError = require '../errors/invalid-form-parameter-error'
InvalidQueryParameterError = require '../errors/invalid-query-parameter-error'
InvalidHeaderError = require '../errors/invalid-header-error'
InvalidBodyError = require '../errors/invalid-body-error'
libxml = require 'libxmljs'
Validators = require './validators'

class Validation
  constructor: (@apiPath, @context, @settings, @resources, @uriTemplateReader, @logger) ->
    @logger.info 'Osprey::Validations has been initialized successfully'

  exec: (req, res, next) =>
    regex = new RegExp "^\\" + @apiPath + "(.*)"
    urlPath = regex.exec req.url

    if urlPath and urlPath.length > 1
      uri = urlPath[1].split('?')[0]
      template = @uriTemplateReader.getTemplateFor(uri)

      if template?
        resource = @resources[template.uriTemplate]

        if resource?
          @validateRequest resource, req

    next()

  validateRequest: (resource, req) =>
    method = @methodInfoFor resource, req.method.toLowerCase()

    @validateUriParams resource, req

    if method?
      @validateQueryParams method, req

      @validateHeaders method, req

      @validateFormParams method, req

      unless @validateSchema method, req
        throw new InvalidBodyError {}

  isForm: (req) ->
    req.headers['content-type'] in ['application/x-www-form-urlencoded', 'multipart/form-data']

  isJson: (req) ->
    req?.headers?['content-type']?.split(/;/)?[0]?.match(/^application\/([\w!#\$%&\*`\-\.\^~]*\+)?json$/i)

  isXml: (req) ->
    if req.headers?['content-type']?
      contentType = req?.headers['content-type']?.split(/;/)?[0]
      contentType in ['application/xml', 'text/xml'] or contentType.match '\\+xml$'

  validateSchema: (method, req) =>
    if method.body?
      contentType = method.body[req?.headers?['content-type']?.split(/;/)?[0]]

      if contentType?.schema?
        if @isJson req
          schemaValidator = new SchemaValidator()
          return not (schemaValidator.validate req.body, JSON.parse contentType.schema).errors.length
        else if @isXml req
          if req.rawBody?
            xml = libxml.parseXmlString req.rawBody
            xsd = libxml.parseXmlString contentType.schema
            return xml.validate(xsd)
    true

  methodInfoFor: (resource, httpMethod) ->
    if resource.methods?
      for method in resource.methods
        if method.method == httpMethod
          return method

    return null

  readValidationInfo: (key, value, validationDescriptor) ->
    delete validationDescriptor.description
    delete validationDescriptor.displayName
    delete validationDescriptor.example

    validationInfo =
      parameter: key
      value: value
      validationRule: validationDescriptor

    validationInfo

  validateUriParams: (resource, req) =>
    if resource.uriParameters?
      uri = req.url.replace @apiPath, ''

      reqUriParameters = @uriTemplateReader.getUriParametersFor uri

      for key, ramlUriParameter of resource.uriParameters
        if not @isValid reqUriParameters[key], ramlUriParameter
          @logger.error "Invalid URI Parameter :#{key} - Request: #{req.url}, Parameter value: #{reqUriParameters[key]}"
          @logger.data "Validation rule", ramlUriParameter
          throw new InvalidUriParameterError @readValidationInfo(key, reqUriParameters[key], ramlUriParameter)

  validateFormParams: (method, req) =>
    if @isForm req
      formParameters = method.body?['multipart/form-data']
      formParameters = method.body?['application/x-www-form-urlencoded'] unless formParameters?
      formParameters = formParameters?.formParameters

      for key, ramlFormParameter of formParameters
        reqFormParam = req.body[key]
        if not @isValid reqFormParam, ramlFormParameter
          @logger.error "Invalid Form Parameter :#{key} - Request: #{req.url}, Parameter value: #{reqFormParam}"
          @logger.data "Validation Info", ramlFormParameter
          throw new InvalidFormParameterError @readValidationInfo(key, reqFormParam, ramlFormParameter)

  validateQueryParams: (method, req) =>
    if method.queryParameters?
      for key, ramlQueryParameter of method.queryParameters
        reqQueryParam = req.query[key]
        if not @isValid reqQueryParam, ramlQueryParameter
          @logger.error "Invalid Query Parameter :#{key} - Request: #{req.url}, Parameter value: #{reqQueryParam}"
          @logger.data "Validation Info", ramlQueryParameter
          throw new InvalidQueryParameterError @readValidationInfo(key, reqQueryParam, ramlQueryParameter)

  validateHeaders: (method, req) =>
    if method.headers?
      for key, ramlHeader of method.headers
        reqHeader = req.headers[key]
        if not @isValid reqHeader, ramlHeader
          @logger.error "Invalid Header :#{key} - Request: #{req.url}, Header value: #{reqHeader}"
          @logger.data "Validation Info", ramlHeader
          throw new InvalidHeaderError @readValidationInfo(key, reqHeader, ramlHeader)

  isValid: (reqParam, ramlParam) =>
    # If the parameter is empty, validate based on if the param was required.
    return not ramlParam.required unless reqParam?

    switch ramlParam.type
      when 'string' then @validateString reqParam, ramlParam
      when 'number' then @validateNumber reqParam, ramlParam
      when 'integer' then @validateInt reqParam, ramlParam
      when 'boolean' then @validateBoolean reqParam, ramlParam
      when 'date' then @validateDate reqParam, ramlParam
      else true

  validateString: (reqParam, ramlParam) ->
    Validators.StringValidator.validate reqParam, ramlParam

  validateNumber: (reqParam, ramlParam) ->
    Validators.NumberValidator.validate reqParam, ramlParam

  validateInt: (reqParam, ramlParam) ->
    Validators.IntegerValidator.validate reqParam, ramlParam

  validateBoolean: (reqParam, ramlParam) ->
    Validators.BooleanValidator.validate reqParam, ramlParam

  validateDate: (reqParam, ramlParam) ->
    Validators.DateValidator.validate reqParam, ramlParam

module.exports = Validation

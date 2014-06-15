class DefaultParameters
  constructor: (@apiPath, @context, @settings, @resources, @uriTemplateReader, @logger) ->
    @logger.info 'Osprey::DefaultParameters has been initialized successfully'

  exec: (req, res, next) =>
    regex = new RegExp "^\\" + @apiPath + "(.*)"
    urlPath = regex.exec req.url

    if urlPath and urlPath.length > 1
      uri = urlPath[1].split('?')[0]

      template = @uriTemplateReader.getTemplateFor(uri)
      
      if template?
        resource = @resources[template.uriTemplate]

        if resource?
          httpMethod = @getMethodInfoFrom req.method, resource

          if httpMethod?
            @loadDefaults req, httpMethod

    next()

  getMethodInfoFrom: (httpMethod, resource) ->
    if resource.methods?
      for method in resource.methods
        if method.method == httpMethod.toLowerCase()
          return method

    return null

  loadDefaults: (req, method) ->
    @checkQueryParamters req, method
    @checkHeaders req, method
    @checkFormParameters req, method

  checkQueryParamters: (req, method) ->
    if method.queryParameters?
      for key, parameterSettings of method.queryParameters
        queryParameter = req.query[key]
        unless queryParameter?
          req.query[key] = parameterSettings.default
          @logger.debug "Query Parameter #{key} defaulted to #{parameterSettings.default} - Request: #{req.url}"

  checkHeaders: (req, method) =>
    if method.headers?
      for key, headerSettings of method.headers
        header = req.headers[key]
        unless header?
          req.headers[key] = headerSettings.default
          @logger.debug "Header #{key} defaulted to #{headerSettings.default} - Request: #{req.url}"

  checkFormParameters: (req, method) =>
    if req.headers['content-type'] in ['application/x-www-form-urlencoded', 'multipart/form-data']
      formParameters = method.body?['multipart/form-data']
      formParameters = method.body?['application/x-www-form-urlencoded'] unless formParameters?
      formParameters = formParameters?.formParameters

      for key, parameterSettings of formParameters
        parameter = req.body[key]
        unless parameter?
          req.body[key] = parameterSettings.default
          @logger.debug "Form Parameter #{key} defaulted to #{parameterSettings.default} - Request: #{req.url}"

module.exports = DefaultParameters

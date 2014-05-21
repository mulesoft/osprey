errorDefaultSettings = require '../error-default-settings'

class ErrorHandler
  constructor: (@apiPath, @context, @settings, @resources, @uriTemplateReader, @logger) ->
    @logger.info 'Osprey::ExceptionHandler has been initialized successfully'

    for key,value of settings.exceptionHandler
      errorDefaultSettings[key] = value

  exec: (err, req, res, next) ->
    errorHandler = errorDefaultSettings[err.constructor.name]

    if errorHandler?
      errorHandler err, req, res, next
    else if err
      throw err
    else
      next()

module.exports = ErrorHandler

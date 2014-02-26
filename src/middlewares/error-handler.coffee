errorDefaultSettings = require '../error-default-settings'

class ErrorHandler
  constructor: (@apiPath, @resources, @uriTemplateReader, @logger, settings) ->
    @logger.info 'Osprey::ExceptionHandler has been initialized successfully'

    for key,value of settings
      errorDefaultSettings[key] = value

  exec: (err, req, res, next) ->
    errorHandler = errorDefaultSettings[err.constructor.name]

    if errorHandler?
      errorHandler err, req, res, next
    else
      next()

module.exports = ErrorHandler
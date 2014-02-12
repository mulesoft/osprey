class LoggerMock
  constructor: ->
    @infoMessages = []
    @errorMessages = []
    @debugMessages = []

  info: (message) =>
    @infoMessages.push message

  error: (message) =>
    @errorMessages.push message

  debug: (message) =>
    @debugMessages.push message

module.exports = LoggerMock
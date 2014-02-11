class LoggerMock
  constructor: ->
    @infoMessages = []
    @errorMessages = []

  info: (message) =>
    @infoMessages.push message

  error: (message) =>
    @errorMessages.push message

module.exports = LoggerMock
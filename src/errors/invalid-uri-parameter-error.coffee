class InvalidUriParameterError extends Error
  constructor: (@context) ->
    super

module.exports = InvalidUriParameterError
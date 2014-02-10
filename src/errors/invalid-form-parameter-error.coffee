class InvalidFormParameterError extends Error
  constructor: (@context) ->
    super

module.exports = InvalidFormParameterError
class InvalidQueryParameterError extends Error
  constructor: (@context) ->
    super

module.exports = InvalidQueryParameterError
class InvalidBodyError extends Error
  constructor: (@context) ->
    super

module.exports = InvalidBodyError
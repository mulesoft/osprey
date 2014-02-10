class InvalidHeaderError extends Error
  constructor: (@context) ->
    super

module.exports = InvalidHeaderError
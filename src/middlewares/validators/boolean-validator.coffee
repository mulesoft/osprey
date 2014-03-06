class BooleanValidator
  validate: (value, rules) ->
    return true unless rules.type == 'boolean'

    "true" == value or "false" == value

module.exports = BooleanValidator
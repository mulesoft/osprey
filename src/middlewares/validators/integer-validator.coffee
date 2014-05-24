class IntegerValidator
  validate: (value, rules) ->
    return true unless rules.type == 'integer'

    number = Number value

    return false if number % 1 != 0

    if rules.minimum? and number < rules.minimum
      return false
    if rules.maximum? and number > rules.maximum
      return false
    true

module.exports = IntegerValidator

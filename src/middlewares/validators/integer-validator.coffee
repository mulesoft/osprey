class IntegerValidator
  validate: (value, rules) ->
    return true unless rules.type == 'integer'

    number = parseInt value

    return false if isNaN(number)

    if rules.minimum? and number < rules.minimum
      return false
    if rules.maximum? and number > rules.maximum
      return false
    true

module.exports = IntegerValidator
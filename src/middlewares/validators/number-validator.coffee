class NumberValidator
  validate: (value, rules) ->
    return true unless rules.type == 'number'

    number = parseFloat value

    return false if isNaN(number)

    if rules.minimum? and number < rules.minimum
      return false
    if rules.maximum? and number > rules.maximum
      return false
    true

module.exports = NumberValidator
moment = require 'moment'

class DateValidator
  validate: (value, rules) ->
    return true unless rules.type == 'date'

    moment(value).isValid()

module.exports = DateValidator
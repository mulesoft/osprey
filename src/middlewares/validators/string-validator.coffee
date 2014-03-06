class StringValidator
  validate: (value, rules) ->
    return true unless rules.type == 'string'

    if rules.pattern?
      matcher = new RegExp rules.pattern, 'ig'
      unless matcher.test(value)
        return false
    if rules.minLength? and value.length < rules.minLength
      return false
    if rules.maxLength? and value.length > rules.maxLength
      return false
    if rules.enum? and not (value in rules.enum)
      return false
    true

module.exports = StringValidator
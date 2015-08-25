var json = require('./json')

module.exports = {
  type: json.type,
  enum: json.enum,
  pattern: json.pattern,
  minLength: json.minLength,
  maxLength: json.maxLength,
  minimum: json.minimum,
  maximum: json.maximum,
  required: json.required,
  repeat: {}
}

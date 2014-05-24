fs = require 'fs'
path = require 'path'
validators = {}

fs.readdirSync(__dirname).filter (file) ->
  (file != 'index.coffee' and path.extname(file) == '.coffee') or (file != 'index.js' and path.extname(file) == '.js')
.forEach (file) ->
  temp = new (require path.join(__dirname, file))
  validators[temp.constructor.name] = new (require path.join(__dirname, file))

module.exports = validators

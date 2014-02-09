winston = require 'winston'
colors = require 'colors'

colors.setTheme
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'

logger = new(winston.Logger)({
  transports: [
      new(winston.transports.Console)(
        colorize: true
      )
  ],
  levels: {
    info: 2,
    Osprey: 3
  },
  colors: {
    Osprey: 'cyan'
  }
})

logLevel = 'off'

exports.setLevel = (level) ->
  logLevel = level if level?

exports.info = (message) ->
  if logLevel in ['info', 'debug']
    logger.log 'Osprey', message.info

exports.error = (message) ->
  if logLevel in ['info', 'debug']
    logger.log 'Osprey', message.error

exports.warn = (message) ->
  if logLevel in ['info', 'debug']
    logger.log 'Osprey', message.warn

exports.debug = (message) ->
  if logLevel in ['debug']
    logger.log 'Osprey', message.debug

exports.data = (description, data) ->
  if logLevel in ['debug']
    logger.log 'Osprey', description.data
    for key,value of data
      logger.log 'Osprey', "  #{key}: #{value}".replace(/\n$/, '').data
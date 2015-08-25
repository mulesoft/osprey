var extend = require('xtend')
var compile = require('dot').compile
var Negotiator = require('negotiator')
var escapeHtml = require('escape-html')
var debug = require('debug')('osprey:error-handler')

var htmlDocument = compile([
  '<!doctype html>',
  '<html>',
  '<head>',
  '<meta charset="utf-8">',
  '<title>{{!it.title}}</title>',
  '<style>',
  '*{margin:0;padding:0;outline:0;}',
  'body{padding:80px 100px;font:13px "Helvetica Neue", "Lucida Grande", "Arial";background:#ECE9E9 -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#ECE9E9));background:#ECE9E9 -moz-linear-gradient(top, #fff, #ECE9E9);background-repeat:no-repeat;color:#555;-webkit-font-smoothing: antialiased;}',
  'h1,h2{font-size:22px;color:#343434;}',
  'h1{font-size:60px;margin-bottom:10px;}',
  'ul li{list-style:none;}',
  '</style>',
  '</head>',
  '<body>',
  '<div id="wrapper">',
  '<h1>{{!it.title}}</h1>',
  '<ul>{{~it.errors :e}}',
  '  <li><strong>{{!e.type}}{{?e.dataPath}} ({{!e.dataPath}}){{?}}:</strong> {{!e.message}}</li>',
  '{{~}}</ul>',
  '</div>',
  '</body>',
  '</html>'
].join(''))

/**
 * Expose a consistent API pattern.
 *
 * @return {Function}
 */
module.exports = handler

/**
 * Map of error handling messages.
 */
var errorMessages = {
  json: require('./messages/json'),
  header: require('./messages/header'),
  query: require('./messages/query'),
  form: require('./messages/form'),
  xml: require('./messages/xml')
}

/**
 * Default responder handles many different output types.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 */
function responder (req, res, errors) {
  var negotiator = new Negotiator(req)

  switch (negotiator.mediaType(['application/json', 'text/html', 'text/xml'])) {
    case 'application/json':
      sendJson(req, res, errors)
      return
    case 'text/html':
      sendHtml(req, res, errors)
      return
    case 'text/xml':
      sendXml(req, res, errors)
      return
    default:
      sendPlain(req, res, errors)
      return
  }
}

/**
 * Send an XML document of errors back to the user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 */
function sendXml (req, res, errors) {
  var xml = '<?xml version="1.0" encoding="UTF-8"?>'

  xml += '<errors>' + errors.map(function (error) {
    return '<error>' + Object.keys(error).map(function (key) {
      var value = error[key]

      // Only the `meta` object is an object.
      if (typeof value !== 'object') {
        return '<' + key + '>' + escapeHtml(value) + '</' + key + '>'
      }

      var attrs = Object.keys(value).map(function (key) {
        return escapeHtml(key) + '="' + escapeHtml(value[key]) + '"'
      })

      return '<' + key + ' ' + attrs.join(' ') + ' />'
    }).join('') + '</error>'
  }) + '</errors>'

  var buf = new Buffer(xml, 'utf8')

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Content-Length', buf.length)
  res.end(buf, 'utf8')
}

/**
 * Send a HTML document of errors back to the user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 */
function sendHtml (req, res, errors) {
  var buf = new Buffer(htmlDocument({
    title: 'Invalid Request',
    errors: errors
  }), 'utf8')

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Content-Length', buf.length)
  res.end(buf, 'utf8')
}

/**
 * Send plain text errors back to the user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 */
function sendPlain (req, res, errors) {
  var buf = new Buffer(errors.map(function (error) {
    var msg = error.type

    if (error.dataPath) {
      msg += ' (' + error.dataPath + ')'
    }

    msg += ': ' + error.message

    return msg
  }).join('\n'), 'utf8')

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Content-Length', buf.length)
  res.end(buf, 'utf8')
}

/**
 * Send JSON errors back to the user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 */
function sendJson (req, res, errors) {
  var buf = new Buffer(JSON.stringify({ errors: errors }), 'utf8')

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Length', buf.length)
  res.end(buf, 'utf8')
}

/**
 * Express-style error middleware (uses four arguments).
 *
 * @param {Error}    err
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
function handler (customResponder, fallbackLanguage) {
  var respond = customResponder || responder
  var fallback = fallbackLanguage || 'en'

  return function (err, req, res, next) {
    // Only handling Osprey/RAML validation errors.
    if (!err || !err.ramlValidation) {
      return next(err)
    }

    var errors = err.validationErrors
    var negotiator = new Negotiator(req)

    // Extend default error objects with i18n messages.
    var data = errors.map(function (error) {
      var messages = errorMessages[error.type]

      if (!messages[error.keyword]) {
        debug('No messages for "%s %s"', error.type, error.keyword)

        return error
      }

      var language = fallback

      if (req.headers['accept-language']) {
        language = negotiator.language(Object.keys(messages[error.keyword]))
      }

      // Fall back to English when the preferred language is unavailable.
      if (!language) {
        debug(
          'No messages available for "%s %s" in %s, falling back to %s',
          error.type,
          error.keyword,
          negotiator.languages().join(', '),
          fallback
        )

        language = fallback
      }

      var message = messages[error.keyword][language]

      if (!message) {
        debug(
          'No messages available for "%s %s", create a "%s" message as the fallback',
          error.type,
          error.keyword,
          fallback
        )

        return error
      }

      return extend(error, { message: message(error) })
    })

    res.statusCode = 400
    res.setHeader('X-Content-Type-Options', 'nosniff')

    return respond(req, res, data)
  }
}

InvalidAcceptTypeError = require '../errors/invalid-accept-type-error'
InvalidContentTypeError = require '../errors/invalid-content-type-error'

class HttpUtils
  readStatusCode: (methodInfo) ->
    statusCode = 200

    for key of methodInfo.responses
      statusCode = key
      break

    Number statusCode

  setDefaultHeaders: (res, methodInfo) ->
    statusCode = @readStatusCode methodInfo
    for name, value of methodInfo.responses?[statusCode]?.headers
      if value.default?
        res.set name, value.default

  negotiateContentType: (req, res, methodInfo) ->
    isValid = false

    for mimeType of methodInfo.body
      if req.is(mimeType) or not req.get('Content-Type')?
        isValid = true
        return

    unless isValid
      throw new InvalidContentTypeError

  negotiateAcceptType: (req, res, methodInfo, customHandler) ->
    statusCode = @readStatusCode(methodInfo)
    isValid = false
    response = {}

    for mimeType of methodInfo.responses?[statusCode]?.body
      if req.accepts(mimeType)
        res.set 'Content-Type', mimeType
        response = methodInfo.responses[statusCode].body[mimeType]?.example
        isValid = true
        break

    if not isValid && methodInfo.responses?[statusCode]?.body?
      throw new InvalidAcceptTypeError

    if customHandler
      customHandler req, res
    else
      res.status(statusCode).send(response)

module.exports = HttpUtils

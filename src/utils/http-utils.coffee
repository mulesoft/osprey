class HttpUtils
  readStatusCode: (methodInfo) ->
    statusCode = 200

    for key of methodInfo.responses
      statusCode = key
      break

    Number statusCode

  negotiateContentType: (req, res, methodInfo) ->
    isValid = false

    for mimeType of methodInfo.body
      if req.is(mimeType) or not req.get('Content-Type')?
        isValid = true
        return

    unless isValid
      res.send 415

  negotiateAcceptType: (req, res, methodInfo, customHandler) ->
    statusCode = @readStatusCode(methodInfo)
    isValid = false
    response = null

    for mimeType of methodInfo.responses[statusCode].body
      if req.accepts(mimeType)
        res.set 'Content-Type', mimeType
        response = methodInfo.responses[statusCode].body[mimeType].example
        isValid = true
        break

    if not isValid && methodInfo.responses[statusCode].body?
      res.send 406

    unless customHandler?
      customHandler req, res
    else
      res.send(response || statusCode)

module.exports = HttpUtils

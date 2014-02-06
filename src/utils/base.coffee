HttpUtils = require '../utils/http-utils'

class OspreyBase extends HttpUtils
  methodLookup: (resources, httpMethod, uri) ->
    if resources[uri]?.methods?
      methodInfo = resources[uri].methods.filter (method) ->
        method.method == httpMethod

    if methodInfo? and methodInfo.length then methodInfo[0] else null

  resourceLookup: (routes, resources, req) ->
    result = routes[req.method.toLowerCase()].filter (route) ->
      req.url.match(route.regexp)?.length

  readStatusCode: (methodInfo) ->
    statusCode = 200

    for key of methodInfo.responses
      statusCode = key
      break

    Number statusCode

module.exports = OspreyBase
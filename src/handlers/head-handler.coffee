HttpUtils = require '../utils/http-utils'

class ApiKitHeadHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    res.send @readStatusCode(methodInfo)

module.exports = ApiKitHeadHandler

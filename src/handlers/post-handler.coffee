HttpUtils = require '../utils/http-utils'

class ApiKitPostHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, methodInfo

module.exports = ApiKitPostHandler

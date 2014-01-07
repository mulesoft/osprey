HttpUtils = require '../utils/http-utils'

class ApiKitPatchHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    @negotiateContentType req, res, methodInfo
    @negotiateAcceptType req, res, methodInfo

module.exports = ApiKitPatchHandler

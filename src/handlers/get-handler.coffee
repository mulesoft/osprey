HttpUtils = require '../utils/http-utils'

class ApiKitGetHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    # TODO: Add validations
    @negotiateAcceptType req, res, methodInfo

module.exports = ApiKitGetHandler

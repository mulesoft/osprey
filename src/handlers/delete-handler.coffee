HttpUtils = require '../utils/http-utils'

class ApiKitDeleteHandler extends HttpUtils
  resolve: (req, res, methodInfo) ->
    # TODO: Add validations
    res.send @readStatusCode(methodInfo)

module.exports = ApiKitDeleteHandler

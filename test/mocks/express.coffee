class ExpressMock
  constructor: ->
    @middlewares = []
    @routes = {}
    @getMethods = []

  use: (content) =>
    @middlewares.push content

  get: (content) =>
    @getMethods.push content

module.exports = ExpressMock
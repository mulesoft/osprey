class ExpressMock
  constructor: ->
    @middlewares = []
    @allHandlers = []
    @routes = {}
    @getMethods = []
    @postMethods = []
    @putMethods = []
    @deleteMethods = []
    @headMethods = []
    @patchMethods = []
    
  use: (content) =>
    @middlewares.push content

  all: (content) =>
    @allHandlers.push content

  get: (content) =>
    @getMethods.push content

  post: (content) =>
    @postMethods.push content

  put: (content) =>
    @putMethods.push content

  delete: (content) =>
    @deleteMethods.push content

  head: (content) =>
    @headMethods.push content

  patch: (content) =>
    @patchMethods.push content

class ResponseMock
  constructor: ->
    @response = null
  send: (context) ->
    @response = context
  set: (key, value) ->
    @key = key
    @value = value
  status: (status) ->
    @status = status
    this

class RequestMock
  constructor: (@method, @url, @accept, @contentType) ->
    @accept = '*/*' unless @accept?
    @headers = {}
    @query = {}
    @body = {}
  accepts: (mimetype) ->
    return true if @accept == '*/*'
    @accept == mimetype
  is: (mimetype) ->
    @contentType == mimetype
  addHeader: (key, value) =>
    @headers[key] = value
  addQueryParameter: (key, value) =>
    @query[key] = value
  addBodyParameter: (key, value) =>
    @body[key] = value

class MiddlewareMock
  nextCounter: 0
  next: () =>
    @nextCounter = @nextCounter + 1

exports.express = ExpressMock
exports.response = ResponseMock
exports.request = RequestMock
exports.middleware = MiddlewareMock
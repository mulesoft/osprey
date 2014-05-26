utils = require 'express/lib/utils'

class UriTemplateReader
  constructor: (@templates) ->
    @generateUriMatchers(@templates)

  generateUriMatchers: (templates) ->
    for template in templates
      do (template) ->
        regexp = utils.pathRegexp template.uriTemplate, [], false, false
        template.regexp = regexp

  getTemplateFor: (uri) ->
    template = @templates.filter (template) ->
      uri.match(template.regexp)?.length

    if template? and template.length then template[0] else null

  getUriParametersFor: (uri) ->
    uri = uri.replace(/\?.*$/,'')
    template = @getTemplateFor uri
    return null unless template?
    matches = uri.match template.regexp
    keys = template.uriTemplate.match template.regexp

    return null unless keys.length > 1

    uriParameters = {}

    for i in [1..(keys.length - 1)]
      uriParameters[keys[i].replace ':', ''] = matches[i]

    uriParameters

module.exports = UriTemplateReader

/* global describe, beforeEach, it */

var expect = require('chai').expect
var popsicle = require('popsicle')
var server = require('popsicle-server')
var osprey = require('../')
var utils = require('./support/utils')

describe('error handler', function () {
  var app

  beforeEach(function () {
    app = osprey.Router()
  })

  function test (ramlBody, requestBody, headers) {
    var path = '/' + Math.random().toString(36).substr(2)

    app.use(osprey.server({
      resources: [{
        relativeUri: path,
        methods: [{
          method: 'post',
          body: ramlBody
        }]
      }]
    }))

    app.use(osprey.errorHandler())

    app.post(path, utils.response('bad bad bad'))

    return popsicle.post({
      url: path,
      body: requestBody,
      headers: headers,
      use: [popsicle.plugins.concatStream('string')]
    })
      .use(server(utils.createServer(app)))
  }

  // Run test cases.
  function standardTest (acceptLanguage, accept) {
    return test(
      {
        'application/json': {
          schema: JSON.stringify({
            type: 'object',
            properties: {
              username: {
                type: 'string',
                pattern: '^[a-zA-Z][a-zA-Z0-9_-]+$'
              }
            }
          })
        }
      },
      JSON.stringify({ username: '$$$' }),
      {
        'Accept': accept || 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': acceptLanguage
      }
    )
  }

  describe('formats', function () {
    describe('json', function () {
      it('should format messages', function () {
        return standardTest()
          .then(validateJsonResponse([
            {
              message: 'String does not match pattern: ^[a-zA-Z][a-zA-Z0-9_-]+$',
              type: 'json',
              keyword: 'pattern',
              dataPath: '.username',
              schema: '^[a-zA-Z][a-zA-Z0-9_-]+$',
              data: '$$$'
            }
          ]))
      })

      it('should format messages with i18n', function () {
        return standardTest('zh-CN')
          .then(validateJsonResponse([
            {
              message: '字符串不匹配模式: ^[a-zA-Z][a-zA-Z0-9_-]+$',
              type: 'json',
              keyword: 'pattern',
              dataPath: '.username',
              schema: '^[a-zA-Z][a-zA-Z0-9_-]+$',
              data: '$$$'
            }
          ]))
      })

      it('should fallback to default language', function () {
        return standardTest('wt-FL')
          .then(validateJsonResponse([
            {
              message: 'String does not match pattern: ^[a-zA-Z][a-zA-Z0-9_-]+$',
              type: 'json',
              keyword: 'pattern',
              dataPath: '.username',
              schema: '^[a-zA-Z][a-zA-Z0-9_-]+$',
              data: '$$$'
            }
          ]))
      })
    })

    describe('html', function () {
      it('should format as html', function () {
        return standardTest(null, 'text/html')
          .then(function (res) {
            expect(res.body).to.match(/^<!doctype html>/)
            expect(res.headers['content-type']).to.equal('text/html; charset=utf-8')
          })
      })
    })

    describe('xml', function () {
      it('should format as xml', function () {
        return standardTest(null, 'text/xml')
          .then(function (res) {
            expect(res.body).to.match(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
            expect(res.headers['content-type']).to.equal('text/xml; charset=utf-8')
          })
      })
    })

    describe('plain', function () {
      function validate (res) {
        expect(res.body).to.equal('json (.username): String does not match pattern: ^[a-zA-Z][a-zA-Z0-9_-]+$')
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      }

      it('should format as plain text', function () {
        return standardTest(null, 'text/plain').then(validate)
      })

      it('should format as plain text when unknown', function () {
        return standardTest(null, 'foo/bar').then(validate)
      })
    })
  })

  describe('errors', function () {
    var JSON_HEADERS = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    describe('form', function () {
      it('type', function () {
        return test(
          {
            'application/x-www-form-urlencoded': {
              formParameters: {
                a: {
                  type: 'integer'
                }
              }
            }
          },
          'a=hello',
          {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        )
          .then(validateJsonResponse([
            {
              data: 'hello',
              dataPath: 'a',
              keyword: 'type',
              message: 'Invalid type, expected integer',
              schema: 'integer',
              type: 'form'
            }
          ]))
      })
    })

    describe('json', function () {
      it('type', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'string'
              })
            }
          },
          '123',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 123,
              dataPath: '',
              keyword: 'type',
              message: 'Invalid type, expected string',
              schema: 'string',
              type: 'json'
            }
          ]))
      })

      it('pattern', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'string',
                pattern: '^\\d+$'
              })
            }
          },
          '"abc"',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 'abc',
              dataPath: '',
              keyword: 'pattern',
              message: 'String does not match pattern: ^\\d+$',
              schema: '^\\d+$',
              type: 'json'
            }
          ]))
      })

      it('minItems', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'array',
                minItems: 10
              })
            }
          },
          '["abc"]',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: ['abc'],
              dataPath: '',
              keyword: 'minItems',
              message: 'Array is too short, minimum 10',
              schema: 10,
              type: 'json'
            }
          ]))
      })

      it('maxItems', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'array',
                maxItems: 1
              })
            }
          },
          '["abc",123]',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: ['abc', 123],
              dataPath: '',
              keyword: 'maxItems',
              message: 'Array is too long, maximum 1',
              schema: 1,
              type: 'json'
            }
          ]))
      })

      it('minLength', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'string',
                minLength: 10
              })
            }
          },
          '"abc"',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 'abc',
              dataPath: '',
              keyword: 'minLength',
              message: 'String is too short, minimum 10',
              schema: 10,
              type: 'json'
            }
          ]))
      })

      it('maxLength', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'string',
                maxLength: 1
              })
            }
          },
          '"abc"',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 'abc',
              dataPath: '',
              keyword: 'maxLength',
              message: 'String is too long, maximum 1',
              schema: 1,
              type: 'json'
            }
          ]))
      })

      it('minProperties', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'object',
                minProperties: 10
              })
            }
          },
          '{"a":"b"}',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: { a: 'b' },
              dataPath: '',
              keyword: 'minProperties',
              message: 'Too few properties defined, minimum 10',
              schema: 10,
              type: 'json'
            }
          ]))
      })

      it('maxProperties', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'object',
                maxProperties: 1
              })
            }
          },
          '{"a":"b","c":"d"}',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: { a: 'b', c: 'd' },
              dataPath: '',
              keyword: 'maxProperties',
              message: 'Too many properties defined, maximum 1',
              schema: 1,
              type: 'json'
            }
          ]))
      })

      it('minimum', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'integer',
                minimum: 10
              })
            }
          },
          '5',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 5,
              dataPath: '',
              keyword: 'minimum',
              message: 'Value 5 is less than minimum 10',
              schema: 10,
              type: 'json'
            }
          ]))
      })

      it('maximum', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'integer',
                maximum: 10
              })
            }
          },
          '100',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 100,
              dataPath: '',
              keyword: 'maximum',
              message: 'Value 100 is greater than maximum 10',
              schema: 10,
              type: 'json'
            }
          ]))
      })

      it('multipleOf', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'integer',
                multipleOf: 10
              })
            }
          },
          '5',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 5,
              dataPath: '',
              keyword: 'multipleOf',
              message: 'Value 5 is not a multiple of 10',
              schema: 10,
              type: 'json'
            }
          ]))
      })

      it('not', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                not: {
                  type: 'string'
                }
              })
            }
          },
          '"test"',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 'test',
              dataPath: '',
              keyword: 'not',
              message: 'Data matches schema from "not"',
              schema: { type: 'string' },
              type: 'json'
            }
          ]))
      })

      it('required', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'object',
                required: ['a']
              })
            }
          },
          '{"b":true}',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: { b: true },
              dataPath: '.a',
              keyword: 'required',
              message: 'Missing required property: .a',
              schema: ['a'],
              type: 'json'
            }
          ]))
      })

      it('enum', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'string',
                enum: ['a']
              })
            }
          },
          '"b"',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 'b',
              dataPath: '',
              keyword: 'enum',
              message: 'No enum match for: ',
              schema: ['a'],
              type: 'json'
            }
          ]))
      })

      it('format', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'string',
                format: 'email'
              })
            }
          },
          '"hello"',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: 'hello',
              dataPath: '',
              keyword: 'format',
              message: 'Format validation failed (should match format email)',
              schema: 'email',
              type: 'json'
            }
          ]))
      })

      it('uniqueItems', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'array',
                uniqueItems: true
              })
            }
          },
          '[1,2,1]',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: [1, 2, 1],
              dataPath: '',
              keyword: 'uniqueItems',
              message: 'Array items are not unique',
              schema: true,
              type: 'json'
            }
          ]))
      })

      it('additionalItems', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'array',
                items: [{
                  type: 'string'
                }],
                additionalItems: false
              })
            }
          },
          '["a","b"]',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: ['a', 'b'],
              dataPath: '',
              keyword: 'additionalItems',
              message: 'Additional items not allowed',
              schema: false,
              type: 'json'
            }
          ]))
      })

      it('additionalProperties', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'object',
                properties: {
                  a: {
                    type: 'string'
                  }
                },
                additionalProperties: false
              })
            }
          },
          '{"a":"b","c":"d"}',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: { a: 'b', c: 'd' },
              dataPath: '[\'c\']',
              keyword: 'additionalProperties',
              message: 'Additional properties not allowed',
              schema: false,
              type: 'json'
            }
          ]))
      })

      it('oneOf', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                oneOf: [{ type: 'string' }, { type: 'number' }]
              })
            }
          },
          'true',
          JSON_HEADERS
        )
          .then(validateJsonResponse([
            {
              data: true,
              dataPath: '',
              keyword: 'type',
              message: 'Invalid type, expected string',
              schema: 'string',
              type: 'json'
            },
            {
              data: true,
              dataPath: '',
              keyword: 'type',
              message: 'Invalid type, expected number',
              schema: 'number',
              type: 'json'
            },
            {
              data: true,
              dataPath: '',
              keyword: 'oneOf',
              message: 'Data does not match any schemas from "oneOf"',
              schema: [
                {
                  type: 'string'
                },
                {
                  type: 'number'
                }
              ],
              type: 'json'
            }
          ]))
      })

      it('dependencies', function () {
        return test(
          {
            'application/json': {
              schema: JSON.stringify({
                type: 'object',
                dependencies: {
                  a: ['b']
                }
              })
            }
          },
          '{"a":"b"}',
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        )
          .then(validateJsonResponse([
            {
              data: { a: 'b' },
              dataPath: '',
              keyword: 'dependencies',
              message: 'Dependency failed - key must exist',
              schema: { a: ['b'] },
              type: 'json'
            }
          ]))
      })
    })
  })
})

function validateJsonResponse (errors) {
  return function (res) {
    expect(JSON.parse(res.body)).to.deep.equal({ errors: errors })
    expect(res.status).to.equal(400)
  }
}

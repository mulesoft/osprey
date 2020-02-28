/* global describe, it */

const rewire = require('rewire')
const expect = require('chai').expect
const path = require('path')
const wap = require('webapi-parser').WebApiParser
const osprey = rewire('../')
const server = rewire('../lib/server')

const SECURITY_HEADERS = path.join(__dirname, 'fixtures/security-headers.raml')

describe('osprey.addJsonSchema', function () {
  const schemas = {}
  osprey.__set__('ospreyMethodHandler', {
    addJsonSchema: function (schema, key) {
      schemas[key] = schema
    }
  })

  it('should call osprey-method-handler.addJsonSchema', function () {
    const schema = {
      properties: {
        name: {
          type: 'string'
        }
      }
    }
    expect(schemas).to.be.deep.equal({})
    osprey.addJsonSchema(schema, 'cats')
    expect(schemas).to.be.deep.equal({ cats: schema })
  })
})

describe('server.addSecurityHeaders()', function () {
  const addSecurityHeaders = server.__get__('addSecurityHeaders')
  it('should copy headers from security scheme to method', async function () {
    const model = await wap.raml10.parse(`file://${SECURITY_HEADERS}`)
    const resolved = await wap.raml10.resolve(model)
    const oldMethod = resolved.encodes.endPoints[0].operations[0]
    expect(oldMethod.request).to.equal(null)

    addSecurityHeaders(resolved)

    const newMethod = resolved.encodes.endPoints[0].operations[0]
    expect(newMethod.request.headers).to.have.lengthOf(1)
    expect(newMethod.request.headers[0].name.value()).to.equal('Custom-Token')
  })
})

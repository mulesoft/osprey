/* global describe, it */

const expect = require('chai').expect
const popsicleServer = require('popsicle-server').server
const path = require('path')

const osprey = require('../')
const utils = require('./support/utils')
const wap = require('webapi-parser').WebApiParser

const EXAMPLE_RAML_PATH = path.join(__dirname, 'fixtures/error-handler-example.raml')

describe('error handler', function () {
  describe('json', function () {
    this.timeout(5000)
    it('should render json', async function () {
      const model = await wap.raml10.parse(`file://${EXAMPLE_RAML_PATH}`)
      const resolved = await wap.raml10.resolve(model)
      const relPath = resolved.encodes.endPoints[0].relativePath

      const app = osprey.Router()
      app.use(osprey.server(resolved))
      app.use(osprey.errorHandler())
      app.post(relPath, utils.response('bad bad bad'))

      const mw = popsicleServer(utils.createServer(app))
      return utils.makeFetcher(mw).fetch(relPath, {
        method: 'POST',
        body: '123',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        expect(res.headers.get('Content-Type')).to.equal('application/json')
      })
    })
  })
})

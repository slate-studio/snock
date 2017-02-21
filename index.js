'strict mode'

const _             = require('lodash')
const faker         = require('faker')
const nock          = require('nock')
const SwaggerClient = require('swagger-client')

const snock = (swaggerSchemaUri, S) => {
  const apiHost = `http://${S.host}`
  const swaggerSchemaPath = _.replace(swaggerSchemaUri, apiHost, '')
  nock(apiHost)
    .get(swaggerSchemaPath)
    .reply(200, S)

  const client = new SwaggerClient({
    url: swaggerSchemaUri,
    success: () => {
      const mock = (tag, operationID, requestParams, response={}) => {
        if (_.isEmpty(response)) {
          // TODO -> add option to pass not sucess response providing only status code
          // not suceess responses here:
          // client[tag].operations[operationID].responses
          var successResponse = client[tag].operations[operationID].successResponse
          for (property in successResponse) {
            var successStatus = property
          }
          var definition = successResponse[successStatus].definition.properties
          var object = generateFakeObjectFromDefinition(definition)
          var response = { status: successStatus, object: object }
          console.log(response)
        };

        var method = client[tag].operations[operationID].method
        var actionPath = path(tag, operationID, requestParams)

        var mocked = nock(apiHost)[method](actionPath)
          .reply(response.status, response.object)

        return mocked
      }

      const path = (tag, operationID, params) => {
        var actionUrl = client[tag].operations[operationID].urlify(params)
        actionUrl = _.replace(actionUrl, apiHost, '')
        return actionUrl
      }

      const model = (definitionName) => {
        var value = ''
        var definition = client.definitions[definitionName].properties
        var fakeObject = generateFakeObjectFromDefinition(definition)
        return fakeObject
      }

      const generateFakeObjectFromDefinition = (object) => {
        var fakeObject = {}
        for ( p in object) {
          if (!object[p].hasOwnProperty('default')) {

            // When present fromat - it define property(not property type)
            if (object[p].hasOwnProperty('format')) {
              switch (object[p].format) {
                case 'uuid':
                  value = faker.random.uuid()
                  break
                case 'date-time':
                  value = faker.date.recent()
                  break
                case 'date':
                  value = faker.date.recent()
                  break
              }
            } else {
              switch (object[p].type) {
                case 'string':
                  value = faker.lorem.word()
                  break
                case 'integer':
                  value = faker.random.number()
                  break
                case 'boolean':
                  value = true
                  break
                case 'array':
                  value = []
                  break
              }
            }
          } else {
            value = object[p].default
          }
          fakeObject[p] = value
        }
        return fakeObject
      }
    }
  })


  return {path: path, model: model, mock: mock}
}

module.exports = snock

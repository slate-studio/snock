# Snock

Mock http requests based on swagger spec for test

## Usage

! Important: Must be initialize before server (better keep initialize on top of the test file)

Initialize:

```
const swaggerSchemaPath = '/api/swagger'
const swaggerMockSpec = require('../factories/swaggerSpec.json')
const snock = require('../helpers/snock.js')(swaggerSchemaPath, swaggerMockSpec)

```

Generate fake object based on swagger definition: (User - name of definition)

```
var fakeUser = snock.model('User')

```

Generate path for Operation ID:

path(tag, operationID, params)
```
var actionPath = snock.path('User', 'updateUser', { id: 'some_user_id' })
```

Mock http swagger request:

mock(tag, operationID, requestParams, response)

*response - optional
```
snock.mock('Users', 'updateUser', { id: 'some_user_id' }, { status: 200, object: fakeUser})

```


Slate Studio @ 2017
## Description

Nest boilerplate with TypeORM, GraphQL, testing, custom logger, and more.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
or
$ npm run dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod

# docker development (currently reloading very slow)
$ npm run docker:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Unit testing is setup to use fixtures for any service/dependency that the class under test requires. Nest provides us an easy way to provide a dummy value for the provider. This prevents any DB connections from being made and allows us to have full control over the dependencies of the class being tested.

Nest allows us to declare a test module to work within the context of for the test and also provides a way for us to feed in our mocked fixtures for the class' dependencies:

In order to test if a function actually throws an error, we wrap the function call in a try/catch block and perform the expect operation on the `err` object in the catch block.

```ts
provide: 'UserService',
useValue: {
  save() {},
  findOneByEmail() {},
  handleSuccessfulLogin() {},
  handleInvalidPassword() {}
}
```

The value of `provide` is the token of the dependency which defaults to the class name within Nest.

Additional values needed for testing such as database entity instances should be included in the local folder's `fixtures` folder in the case of being local to that module, or in `common/testing/fixtures` for fixtures that might be used across modules in testing.

Any strings/numbers or dummy data should be generated using [faker.js](https://github.com/Marak/Faker.js) when possible.

## Architecture

Nest follows a module, class based, dependency injection architecture. Functionality and data entities should be separated into modules which can then be injested by any other module which requires its functionality. There are a few main types of classes that can be included in a module:

- Module
  - The main file for the folder. This class simply defines what classes it should provide (use across the module itself), export (allow for use in other modules), and import (external modules needed by this one).
- Controller
  - A class to handle any REST API endpoints. The class should be specifically responsible for handling the incoming the request, and then passing off any data to the appropriate service.
- Resolver
  - The GraphQL equivalent of a controller. It is responsible for declaring any queries, mutations, or subscriptions that are used.
- Service
  - The main business logic handlers for the applications. Services should handle any processing of data, interaction with DB, or anything meaningful in general within the application. Functionality within services should be as local to the type of data or specific functionality of the module exporting the service.
- .graphql file
  - Defines the GraphQL schema for the data entity. Schema stitching is handled by the GraphQL Nest module so we can freely define Mutation and Query types here.
- Entity
  - Class representing the actual data that the module is responsible for (if any). This also sets up definitions for TypeORM to translate the class into a database table.
- Command
  - These files are used for the CLI of the application. We can define any type of command we want to be able to run via the CLI which is related to the module.

## Logging

We use a custom logger which is instantiated in each individual class allowing log messages to be tied back to their associated caller. There are 4 total log files that are written to disk. There are two main types with one including all message severities and the other one only including log messages of severity `info` and above. These two log types are also provided in tailable and non-tailable formats.

## Authentication

Authentication is done by a combination of JWT and user roles. Passport via a Nest module is used for setting up the strategy of validating a provided token. In order to protect endpoints, we use Nest guards to specify for the majority of the classes that an auth guard is needed for any method in it. This ensures that validation is performed on the token given during the request while also fetching the associated user object to be referenced further in the call chain.

## Endpoint Scanning

A CLI script has been included to scan through source files looking for endpoints of the application (either REST API or GraphQL). It will then identify if any auth guards or user role validation is being performed on that endpoint and shows a warning if it finds an endpoint without any protection.

This is useful to get a quick view of the exposed endpoints of the application and the protection that is enabled on them.

## CLI

There is a CLI defined for the application that can be run via `./bin/cli`. Available commands and their options will then be shown.

## License

Nest is [MIT licensed](LICENSE).

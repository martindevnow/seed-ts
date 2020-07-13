# Seed-TS

Based in Typescript, this mono-repo covers the project for managing your home garden and tracking your results! This project uses yarn workspaces to manage the independent modules.

This application is broken down into several key components.

- `@mdn-seed/core` manages all of the business logic and use cases via the exposed endpoints. When consuming this, you need to instantiate the services with a database connection that matches the `IDatabase` interface from `@mdn-seed/db`.
- `@mdn-seed/db` manages the interfaces that the `@mdn-seed/core` packages rely on. This module also contains several implementations of this `IDatabase` interface, allowing the consumer to provide their own configuration file and start using the pp right away.
- `@mdn-seed/rest` is a REST API using Express and NodeJS to serve data from Firebase's firestore.
- `@mdn-seed/client` is a React app for interacting with the REST API.

## REST Dev Server

`yarn rest start`

## REST Postman Tests (requires a running server on localhost)

`yarn rest start:newman`

## Unit Tests (runs the unit tests from all modules)

`yarn test`

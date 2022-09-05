<h1 align="center">
  <p align="center">
    <img src="diagrams/icon.png" height="28" width="28" alt="icon">
    Pecuniary
  </p>
</h1>

[![Build](https://github.com/eric-bach/pecuniary/actions/workflows/build.yml/badge.svg)](https://github.com/eric-bach/pecuniary/actions/workflows/build.yml)
[![Deploy](https://github.com/eric-bach/pecuniary/actions/workflows/deploy.yml/badge.svg)](https://github.com/eric-bach/pecuniary/actions/workflows/deploy.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/eric-bach/pecuniary/badge)](https://www.codefactor.io/repository/github/eric-bach/pecuniary)
[![GitHub issues open](https://img.shields.io/github/issues/eric-bach/pecuniary.svg?maxAge=2592000)](https://github.com/eric-bach/pecuniary/issues?q=is%3Aopen+is%3Aissue) [![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/eric-bach/pecuniary.svg?maxAge=2592000)](https://github.com/eric-bach/pecuniary/issues?q=is%3Aissue+is%3Aclosed)
[![Chat](https://img.shields.io/gitter/room/pecuniary/community)](https://gitter.im/pecuniary/community) ![license](https://img.shields.io/badge/license-MIT-blue.svg)

<p align="center">
  <a href="#getting-started">Getting Started</a> |
  <a href="ARCHITECTURE.md">Architecture</a> |
  <a href="#deployment">Development</a> |
  <a href="https://trello.com/b/7lA2gwTs/pecuniary">Trello</a> |
  <a href="#project-resources">Resources</a>
</p>

<p align="center">
  An <strong>event-driven serverless microservices</strong> application built with <a href="https://nodejs.org">Node.js</a>
  <br />
   ⚠️ <strong>NOTE</strong> ⚠️ The Event Sourcing and CQRS version is no longer maintained.  Please see <a href="()https://github.com/eric-bach/pecuniary/tree/cqrs-v1">branch</a> and <a href="()https://github.com/eric-bach/pecuniary/blob/cqrs-v1/ARCHITECTURE.md">CQRS Architecture</a> for the last release.
</p>

![Top Level](diagrams/toplevel.jpg)

# Getting Started

This quick start guide describes how to get the application running. An `AWS account` is required to deploy the infrastructure required for this project.

1. Clone the project

   ```bash
   $ git clone https://github.com/eric-bach/pecuniary.git
   ```

2. Install backend dependencies for CDK and lambda

   ```bash
   $ cd ./backend
   $ npm install
   # For each lambda in the lib/lambda folder
   $ cd lib/lambda/cognitoPostConfirmation && npm install
   ```

3. Install client dependencies

   ```bash
   $ cd ./client
   $ npm install
   ```

4. Copy the `./backend/.env.example` file to `./backend/.env` and fill in the parameter values:

   - `CDK_DEV_ACCOUNT` - AWS account Id
   - `CDK_PROD_ACCOUNT` - AWS account Id
   - `CDK_DEFAULT_REGION` - AWS region
   - `CERTIFICATE_ARN` - ARN to ACM Certificate for CloudFront Distribution
   - `DLQ_NOTIFICATIONS` - email address to send failed event message notifications to

5. Deploy the backend stack

   a. To the default profile (also deploys frontend)

   ```
   $ npm run deploy
   ```

   b. To a specific profile

   ```
   $ npm run deploy dev AWS_PROFILE_NAME
   ```

   c. To deploy the backend only to a specific profile

   ```
   $ npm run deploy -- -s backend dev AWS_PROFILE_NAME
   ```

6. Copy the `./client/src/aws-exports.js.example` file to `./client/src/aws-exports.js` and fill in the parameter values (use dummy values until the backend is first deployed):

   - aws_project_region: AWS Region,
   - aws_cognito_region: AWS Cognito Region,
   - aws_user_pools_id: AWS Cognito User Pool Id
   - aws_user_pools_web_client_id: AWS Cognito User Pool Web Client Id,
   - aws_appsync_graphqlEndpoint: AWS AppSync GraphQL Endpoint

7. Copy the `./client/.env.example` file to `./client/.env` and `./client/.env.prod` and fill in the parameter values from the CDK stack outputs in step 2:

   - `REACT_APP_COGNITO_USERPOOL_ID` - AWS Cognito User Pool Id created in step 2
   - `REACT_APP_COGNITO_CLIENT_ID` - AWS Cognito User Pool client Id created in step 2

8. Start the client locally on http://localhost:3000/

   ```bash
   $ npm start
   ```

# Event Sourcing and CQRS Architecture

For more detailed information about the event-driven nature of the Pecuniary application and it's architecture, please see the [Architecture.md](ARCHITECTURE.md)

# Deployment

## Deployment with CDK CLI

The Pecuniary application consists of the CDK backend and React frontend, each of which has an independent method of deploying.

### Deploy backend via CDK script

1. Bootstrap CDK (one-time only)

   ```
   $ cdk bootstrap aws://{ACCOUNT_ID}/{REGION} --profile {PROFILE_NAME}}
   ```

2. Ensure AWS credentials are up to date. If using AWS SSO, authorize a set of temporary credentials

   ```bash
   aws sso login
   ```

3. Navigate to the `backend` folder

   ```bash
   $ cd backend
   ```

4. Deploy CDK stack.

   ```bash
   $ npm run deploy PROFILE_NAME
   ```

### Deploy frontend

1. Navigate to `client` folder

   ```bash
   $ cd client
   ```

2. Deploy CDK stack

   ```bash
   TBA - To be added
   ```

## Deployment via GitHub Actions

1. Create an AWS user with access id/secret to deploy the CDK stack from GitHub Actions. The user should have Administrative rights.

2. Add the following GitHub Secrets to the repository

   ```
   AWS_ACCESS_KEY_ID - AWS access key id (to prod account for backend resources)
   AWS_ACCESS_KEY_SECRET = AWS access key secret (to prod account for backend resources)
   CDK_DEFAULT_REGION - AWS default region for all resources to be created
   CDK_DEV_ACCOUNT - AWS Account Id of development account
   CDK_PROD_ACCOUNT - AWS Account Id of production account
   CERTIFICATE_ARN - ARN to ACM certificate for CloudFront Distribution
   DLQ_NOTIFICATIONS - email address to send DLQ messages to
   REACT_APP_COGNITO_CLIENT_ID - Cognito User Pool Client Id
   REACT_APP_COGNITO_USERPOOL_ID - Cognito User Pool Id
   AWS_APPSYNC_GRAPHQL_ENDPOINT - AWS AppSync GraphQL endpoint URL
   ```

# Projects References

Links to additional documentation specific to the Application

## AppSync

- [Saved GraphQL queries/mutations for GraphiQl](docs/GraphQL.md)
- [How to add a new GraphQL API/Command Handler](docs/CommandHandler.md)
- [How to call an authenticated AppSync GraphQL API with Apollo Client](docs/ApolloClient.md)

# Resources

Various links to additional articles/tutorials used to build this application.

## AppSync

- [How to build an authenticated GraphQL AppSync API with CDK](https://github.com/dabit3/build-an-authenticated-api-with-cdk)
- [How to perform a GraphQL Query with Apollo using React hooks](https://www.yannisspyrou.com/querying-app-sync-using-react-hooks)
- [How to perform a GraphQL Mutation with Apollo using React hooks](https://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/)

## Cognito

- [How to add a protected route to React](https://dev.to/olumidesamuel_/implementing-protected-route-and-authentication-in-react-js-3cl4)
- [How to authenticate with Cognito using React hooks](https://github.com/DevAscend/YT-AWS-Cognito-React-Tutorials)
- [How to add a user to a Cognito User Group](https://bobbyhadz.com/blog/aws-cognito-add-user-to-group)

# License

This project is licensed under the terms of the [MIT license](/LICENSE).

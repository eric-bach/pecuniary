<h1 align="center">
  <p align="center">
    <img src="diagrams/icon.png" height="28" width="28" alt="icon">
    Pecuniary
  </p>
</h1>

[![Build](https://github.com/eric-bach/pecuniary/actions/workflows/test.yml/badge.svg)](https://github.com/eric-bach/pecuniary/actions/workflows/test.yml)
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

## Configure the app

1.  Clone the project

    ```bash
    $ git clone https://github.com/eric-bach/pecuniary.git
    ```

2.  Install dependencies for CDK

    ```bash
    $ cd ./backend
    $ npm install
    ```

3.  Install dependencies for the rest of the application using the recursive-install script

    ```bash
    $ cd ./backend
    $ npm recursive-install
    ```

4.  Copy the `./backend/.env.example` file to `./backend/.env` and fill in the parameter values (if the app has not been deployed to AWS yet, the ARN will be empty for now):

    - `CERTIFICATE_ARN` - ARN to ACM Certificate for CloudFront Distribution
    - `DLQ_NOTIFICATIONS` - email address to send failed event message notifications to

5.  Copy the `./frontend/container/.env.example` file to `./frontend/container/.env` and `./frontend/container/.env.prod` and fill in the parameter values from the CDK stack outputs in step 2:

    - `PRODUCTION_DOMAIN` - AWS CloudFront Distribution domain name created in step 2
    - `REACT_APP_COGNITO_USERPOOL_ID` - AWS Cognito User Pool Id created in step 2
    - `REACT_APP_COGNITO_CLIENT_ID` - AWS Cognito User Pool client Id created in step 2
    - `REACT_APP_APPSYNC_ENDPOINT` - AWS AppSync GraphQL endpoint URL created in step 2
    - `REACT_APP_APPSYNC_REGION` - AWS AppSync region

## Deploy the app

1.  Follow the steps in [Deployment with CDK CLI](#deployment-with-cdk-cli)

## Running the app locally

1.  Start the MFE frontend:

    a. with each MFE app individually

    ```bash
    // Start marketing MFE on https://localhost:8081
    $ cd frontend/marketing
    $ npm run start

    // Start auth MFE on https://localhost:8082
    $ cd ../../frontend/auth
    $ npm run start

    // Start dashbaord MFE on https://localhost:8083
    $ cd ../../frontend/dashboard
    $ npm run start

    // Start host/container MFE on https://localhost:8080
    $ cd ../../frontend/container
    $ npm run start
    ```

    b. as one command (note: any error encountered with each MFE may not be surfaced with this approach)

    ```bash
    $ npm run start --prefix ./marketing & npm run start --prefix ./auth & npm run start --prefix ./dashboard & npm run start --prefix ./container
    ```

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
   aws sso login --profile PROFILE_NAME
   ```

3. Deploy the Stacks

   a. To deploy all stacks (backend + frontend)

   ```
   $ npm run deploy dev PROFILE_NAME
   ```

   b. To deploy a specific stage

   ```
   // Deploy a specific stage for the 'dev' environment to the PROFILE_NAME
   $ npm run deploy-backend dev PROFILE_NAME
   $ npm run deploy-frontend dev PROFILE_NAME
   ```

## Deployment via GitHub Actions

1. Create an AWS role that can be assumed by GitHub Actions

   ```
   $ npm run deploy-cicd prod PROFILE_NAME
   ```

2. Add the following GitHub Secrets to the repository

   ```
   AWS_ACCESS_ARN - AWS ARN of the GitHub Actions Role to Assume (from step 1)
   CDK_DEFAULT_REGION - AWS default region for all resources to be created
   CERTIFICATE_ARN - ARN to ACM certificate for CloudFront Distribution
   DLQ_NOTIFICATIONS - email address to send DLQ messages to
   PRODUCTION_DOMAIN - AWS CloudFront Distribution domain name
   REACT_APP_COGNITO_USERPOOL_ID - Cognito User Pool Id
   REACT_APP_COGNITO_CLIENT_ID - Cognito User Pool Client Id
   REACT_APP_APPSYNC_ENDPOINT - AWS AppSync GraphQL endpoint URL
   REACT_APP_APPSYNC_REGION - AWS AppSync region
   CYPRESS_USERNAME - A valid Cognito username for Cypress integration testing
   CYPRESS_PASSWORD - The Cognito password for Cypress integration testing
   ```

# Testing

## Cypress

### Locally

Test the frontend using cypress

```
$ npm run cypress:open

or headless,

$ npm run cypress:run
```

### GitHub Actions

Ensure to configure the GitHub Secrets to include:

    ```
    CYPRESS_USERNAME - A valid Cognito username for Cypress integration testing
    CYPRESS_PASSWORD - The Cognito password for Cypress integration testing
    ```

# Event Sourcing and CQRS Architecture

For more detailed information about the event-driven nature of the Pecuniary application and it's architecture, please see the [Architecture.md](ARCHITECTURE.md)

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

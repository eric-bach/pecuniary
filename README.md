<h1 align="center">
  <p align="center">
    <img src="diagrams/icon.png" height="28" width="28" alt="icon">
    Pecuniary
  </p>
</h1>

<p align="center">
  <a href="diagrams">Diagrams</a> |
  <a href="ARCHITECTURE.md">Architecture</a> |
  <a href="#getting-started">Getting Started</a> |
  <a href="#environment-setup">Development</a>
</p>

<p align="center">
  <a href="https://gitter.im/pecuniary/community">
    <img src="https://img.shields.io/gitter/room/pecuniary/community" alt="Gitter"/>
  </a>
  <a href="https://www.codefactor.io/repository/github/eric-bach/pecuniary"><img src="https://www.codefactor.io/repository/github/eric-bach/pecuniary/badge" alt="CodeFactor" /></a>
  <a href="https://cypress.io">
    <img src="https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square" alt="cypress"/>
  </a>
  <a href="https://github.com/eric-bach/pecuniary/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  </a>
</p>

<h3 align="center">
  Built with event sourcing and CQRS
</h3>

<p align="center">
  An event-driven serverless microservices application built with <a href="https://nodejs.org">Node.js</a>
</p>

![Top Level](diagrams/toplevel.jpg)

# Roadmap

Please see the [Trello board](https://trello.com/b/7lA2gwTs/pecuniary)

# Getting Started

1. Clone project and install dependencies

   ```bash
   $ git clone https://github.com/eric-bach/pecuniary-v3.git
   $ cd pecuniary-v3
   $ cd backend && npm install
   $ cd ../client && npm install
   ```

2. Copy the `./backend/deploy-cdk.ps1.example` file to `./backend/deploy-cdk.ps1` and replace `AWS_PROFILE` in the file with your AWS credentials profile name

   ```
   # Deploy CDK
   cmd.exe /c cdk deploy --profile AWS_PROFILE pecuniary-dev
   ```

3. Copy the `./backend/.env.example` file to `./backend/.env` and fill in the parameter values:

   a. DLQ_NOTIFICATIONS - email address to send failed event message notifications to

   b. ALPHA_VANTAGE_API_KEY - AlphaVantage API key to lookup quotes

4. Start the project

   ```bash
   $ npm start
   ```

5. Run the app

   ```bash
   http://localhost:3000/
   ```

# Deployment

## Deployment with CDK CLI

The Pecuniary application consists of the CDK backend and CDK frontend, each of which has an independent method of deploying.

### Deploy backend via script

1. Ensure AWS credentials are up to date. If using AWS SSO, generate new temporary credentials

   ```
   aws sso login
   ```

2. Navigate to `backend` folder

   ```
   $ cd backend
   ```

3. Deploy CDK stack
   ```
   $ ./deploy-cdk.ps1
   ```

### Deploy backend via CLI

1. Bootstrap CDK (one-time)

   ```
   $ cdk bootstrap aws://ACCOUNT/us-east-1 --profile PROFILE_NAME
   ```

2. Navigate to `backend` folder

   ```
   $ cd backend
   ```

3. Deploy CDK stack
   ```
   $ cdk deploy --profile PROFILE_NAME pecuniary-dev
   ```

### Deploy frontend

1. Navigate to `client` folder

   ```
   $ cd client
   ```

2. Deploy CDK stack
   ```
   TBA
   ```

## Deployment with CodePipeline (optional)

See [pecuniary-pipeline](https://github.com/eric-bach/pecuniary-v3/blob/main/README.md)

# Projects References

[Saved GraphQL queries/mutations for GraphiQl](docs/GraphQL.md)
[How to add a new GraphQL API/Command Handler](docs/CommandHandler.md)

# Resources

## AppSync

[How perform a GraphQL Query with Apollo using React hooks](https://www.yannisspyrou.com/querying-app-sync-using-react-hooks)
[How perform a GraphQL Mutation with Apollo using React hooks](ttps://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/)

## Cognito

[How to add a protected route to React](https://dev.to/olumidesamuel_/implementing-protected-route-and-authentication-in-react-js-3cl4)
[How to authenticate with Cognito using React hooks](https://github.com/DevAscend/YT-AWS-Cognito-React-Tutorials)

# License

This project is licensed under the terms of the [MIT license](/LICENSE).

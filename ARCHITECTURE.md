<h1 align="center">
  <p align="center">
    <img src="./diagrams/icon.png" height="28" width="28" alt="icon">
    Pecuniary
  </p>
</h1>

# Architecture overview

Pecuniary is an **event-driven serverless microservices** application built with <a href="https://nodejs.org">Node.js</a> using **ReactJS** for the frontend, a **single-table NoSQL** for the backend, and integration through **GraphQL** using AWS AppSync.

This diagram represents how each of the pieces of the application interface with each other. The design of each individual component within this architecture is desribed below _(more will be added as the project progresses)_.

For an listing of the technologies used please see <a href="#technology-stack">Technology stack</a>.

![Top Level](./diagrams/toplevel.jpg)

# Detailed architecture

- <a href='#user-authentication-with-aws-cognito'>User authentication with AWS Cognito</a>
- <a href='#protecting-routes-in-react-router'>Protecting routes in React Router</a>
- <a href='#handling-events'>Handing events</a>
  - <a href='#example-creating-an-account'>Example: creating an Account</a>
- <a href='#event-bus-error-handling'>Event Bus error handling</a>

## User authentication with AWS Cognito

Authentication is managed with AWS Cognito User Pools within the React client. In the AWS Cognito User Pool, a Users group is created that each user that signs up is added to using a Cognito post-confirmation trigger.

![Login screen](./diagrams/architecture/login_screen.png)

### Sign up

For the sign up process, the `amazon-cognito-identity-js` package is used to create users in the AWS Cognito User Pool. Once the user is created, a verify email is sent for the user to confirm their email address. When the email address is confirmed, a Cognito post-confirmation trigger executes an [AWS lambda function](https://github.com/eric-bach/pecuniary/blob/main/backend/lib/lambda/cognitoPostConfirmation/main.ts) that adds the confirmed user to the appropriate `Pecuniary Users` group.

![Signup](./diagrams/architecture/signup.png)

### Login

Login uses the authenticateUser() hook from the `amazon-cognito-identity-js` package to authentication the user in the AWS Cognito User Pool. If the user is successfully authenticated they will be directed to the `/home` route.

![Login](./diagrams/architecture/login.png)

## Protecting routes in React Router

Protecting unauthenticate users from accessing parts of the application is necessary to keep the application secure. This is managed by using a custom component alongside the [React Router configuration](https://github.com/eric-bach/pecuniary/blob/cqrs-v1/client/src/App.tsx#L28)

The [ProtectedRoute](https://github.com/eric-bach/pecuniary/blob/cqrs-v1/client/src/components/ProtectedRoute.tsx) component checks the Cognito AccessToken in the `localStorage` to determine if a user is authenticated before rendering the requested component. If the user is not authenticated, this component redirects to the `/login` page.

## Database

A single-table DynamoDB NoSQL table is used for the backend

- **Partition Key**: userId
- **Sort Key**: createdAt
- **LSIs**: aggregateId, entity, transactionDate

## Example: creating an Account

A user will fill out the Account form and click `Submit` to create a new Account:

![Create Account](./diagrams/architecture/create_account.png)

When creating an Account, the `AWS Lambda` AccountHandler function resolves the `AWS AppSync` GraphQL API mutation request. The event data from the GraphQL API request is saved to the DynamoDB table:

```
{
    "createAccountInput": {
        "userId": "epic-user",
        "type": "RRSP",
        "name": "Epic Account",
        "description": "My first account"
    }
}
```

The newly created Account then appears on the `/accounts` page.

![Accounts](./diagrams/architecture/account_view.png)

## Example: creating a Transaction

When creating a Transaction, the `AWS Lambda` TransactionHandler function resolves the `AWS AppSync` GraphQL API mutation request. The event data from the GraphQL API request is saved to the DynamoDB table:

```
{
    "createTransactionInput": {
        "userId": "epic-user",
        "aggregateId": "2d5d519b-8715-44d5-af9f-64f3b565c345",
        "type": "Buy",
        "transactionDate": "2022-04-13",
        "symbol": "AAPL",
        "shares": 10,
        "price": 125,
        "commission": 5.99
    }
}
```

The TransactionHandler then sends a message, `TransactionSavedEvent`, through the EventBridge event bus which is subscribed by the UpdatePositionHandler to update the ACB and Position for the symbol.

![Transaction](./diagrams/architecture/create_transaction.png)

The UpdatePositionHandler event handler processes the `TransactionSavedEvent` by calculating the ACB and values for the Position (market, book, shares).

- First it will calcualte the ACB for the symbol
- Then it will retrieve market data for the Symbol in the Transaction through the`Yahoo Finance` APIs.
- Finally it will create or update a Position representing the total asset owned for the symbol in the Transaction, updating the book and market value in the process.

## Event Bus error handling

The Pecuniary event bus has a DLQ that holds failed events from the DynamoDB event stream. A CloudWatch Alarm is configured to monitor for any messages (metric: NumberOfMessagesSent) and publishes to a SNS queue which has an email subscription.

# Technology stack

## Backend

- AWS CDK
- AWS Cognito User Pool
- AWS AppSync GraphQL
- AWS DynamoDB
- AWS EventBridge
- AWS SNS
- AWS SQS
- AWS Lambda
- AWS CloudWatch Events

## Frontend

- AWS CloudFront
- AWS Route 53
- React.js
- React Router
- Formik
- Yup
- Semantic UI React
- Zustand
- Cypress

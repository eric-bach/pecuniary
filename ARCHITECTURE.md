## Architecture

### Diagram

![Top Level](diagrams/toplevel.jpg)

## Technologies used

### Backend

- AWS CDK
- AWS Cognito User Pools
- AWS AppSync GraphQL
- AWS DynamoDB (EventStore, ReadStore)
- DynamoDB Streams
- AWS EventBridge
- AWS SNS
- AWS SQS
- AWS Lambda

### Frontend

- AWS CloudFront
- AWS Route 53
- React.js
- React Router
- Formik
- Yup
- Semantic UI React
- Zustand
- Cypress

## Event Bus error handling

The Pecuniary event bus has a DLQ that holds failed events from the DynamoDB event stream. A CloudWatch Alarm is configured to monitor for any messages (metric: NumberOfMessagesSent) and publishes to a SNS queue which has an email subscription.

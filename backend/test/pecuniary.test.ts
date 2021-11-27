import { expect as expectCDK, haveResource, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Pecuniary from '../lib/pecuniary-stack';

describe('Stack contains expected resources', () => {
  const app = new cdk.App();
  const stack = new Pecuniary.PecuniaryStack(app, 'PecuniaryTestStack', {
    appName: 'pecuniary',
    envName: 'test',
    tags: {
      env: 'test',
      application: 'pecuniary',
    },
    params: {
      dlqNotifications: 'test@test.com',
      alphaVantageApiKey: 'ABC',
    },
  });

  test('SSM Parameters', () => {
    expectCDK(stack).to(
      haveResource('AWS::SSM::Parameter', { Name: 'pecuniary-AlphaVantageAPIKey', Type: 'String', Tier: 'Standard' })
    );
  });

  test('Cognito User Pool', () => {
    expectCDK(stack).to(haveResource('AWS::Cognito::UserPool', { UserPoolName: 'pecuniary_user_pool' }));
    expectCDK(stack).to(haveResource('AWS::Cognito::UserPoolClient', { ClientName: 'pecuniary_user_client' }));
  });

  test('SQS Queues and SNS Topics', () => {
    expectCDK(stack).to(haveResource('AWS::SQS::Queue', { QueueName: 'pecuniary-commandHandler-DeadLetterQueue' }));
    expectCDK(stack).to(haveResource('AWS::SQS::Queue', { QueueName: 'pecuniary-eventBus-DeadLetterQueue' }));
    expectCDK(stack).to(haveResource('AWS::SQS::Queue', { QueueName: 'pecuniary-eventHandler-DeadLetterQueue' }));
    expectCDK(stack).to(haveResource('AWS::SNS::Topic', { TopicName: 'pecuniary-commandHandler-Topic' }));
    expectCDK(stack).to(haveResource('AWS::SNS::Topic', { TopicName: 'pecuniary-eventBus-Topic' }));
    expectCDK(stack).to(haveResource('AWS::SNS::Topic', { TopicName: 'pecuniary-eventHandler-Topic' }));
    //expectCDK(stack).to(haveResource('AWS::SNS::Subscription', { Protocol: 'email' }));
  });

  test('CloudWatch Alarms', () => {
    expectCDK(stack).to(
      haveResource('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 2,
        AlarmName: 'pecuniary-commandHandler-Alarm',
        DatapointsToAlarm: 1,
        MetricName: 'NumberOfMessagesSent',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Sum',
        Threshold: 1,
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 2,
        AlarmName: 'pecuniary-eventBus-Alarm',
        DatapointsToAlarm: 1,
        MetricName: 'NumberOfMessagesSent',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Sum',
        Threshold: 1,
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 2,
        AlarmName: 'pecuniary-eventHandler-Alarm',
        DatapointsToAlarm: 1,
        MetricName: 'NumberOfMessagesSent',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Sum',
        Threshold: 1,
      })
    );
  });

  test('AppSync GraphQL APIs', () => {
    expectCDK(stack).to(
      haveResource('AWS::AppSync::GraphQLApi', { AuthenticationType: 'API_KEY', Name: 'pecuniary-api' })
    );
    expectCDK(stack).to(haveResource('AWS::AppSync::GraphQLSchema'));
    expectCDK(stack).to(haveResource('AWS::AppSync::ApiKey'));
    expectCDK(stack).to(haveResource('AWS::AppSync::DataSource'));
    expectCDK(stack).to(haveResource('AWS::AppSync::Resolver'));
  });

  test('DynamoDB Tables', () => {
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', { TableName: 'pecuniary-Event', BillingMode: 'PAY_PER_REQUEST' })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', { TableName: 'pecuniary-AccountType', BillingMode: 'PAY_PER_REQUEST' })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', { TableName: 'pecuniary-CurrencyType', BillingMode: 'PAY_PER_REQUEST' })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', { TableName: 'pecuniary-ExchangeType', BillingMode: 'PAY_PER_REQUEST' })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', { TableName: 'pecuniary-TransactionType', BillingMode: 'PAY_PER_REQUEST' })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', { TableName: 'pecuniary-AccountReadModel', BillingMode: 'PAY_PER_REQUEST' })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', { TableName: 'pecuniary-PositionReadModel', BillingMode: 'PAY_PER_REQUEST' })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: 'pecuniary-TransactionReadModel',
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', { TableName: 'pecuniary-TimeSeries', BillingMode: 'PAY_PER_REQUEST' })
    );
  });

  test('EventBridge Events', () => {
    expectCDK(stack).to(haveResource('AWS::Events::EventBus', { Name: 'pecuniary-bus' }));
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: 'pecuniary-AccountCreatedEvent',
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountCreatedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: 'pecuniary-AccountUpdatedEvent',
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountUpdatedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: 'pecuniary-AccountDeletedEvent',
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountDeletedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: 'pecuniary-TransactionCreatedEvent',
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionCreatedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: 'pecuniary-TransactionUpdatedEvent',
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionUpdatedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: 'pecuniary-TransactionDeletedEvent',
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionDeletedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: 'pecuniary-TransactionSavedEvent',
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionSavedEvent'],
        },
      })
    );
  });

  test('Lambda Functions', () => {
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-CommandHandler',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-EventBus',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    //expectCDK(stack).to(haveResource('AWS::Lambda::EventSourceMapping'));
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-createAccount',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-updateAccount',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-deleteAccount',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-createTransaction',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-updateTransaction',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-deleteTransaction',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: 'pecuniary-createUpdatePosition',
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
  });
});

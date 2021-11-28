import { PecuniaryStackProps } from './../lib/PecuniaryStackProps';
import { expect as expectCDK, haveResource, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Pecuniary from '../lib/pecuniary-stack';

describe('Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: PecuniaryStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
    params: {
      certificateArn: 'arn',
      dlqNotifications: 'test@test.com',
      alphaVantageApiKey: 'ABC',
    },
  };
  const stack = new Pecuniary.PecuniaryStack(app, 'PecuniaryTestStack', props);

  test('SSM Parameters', () => {
    expectCDK(stack).to(
      haveResource('AWS::SSM::Parameter', {
        Name: `pecuniary-AlphaVantageAPIKey-${props.envName}`,
        Type: 'String',
        Tier: 'Standard',
      })
    );
  });

  test('Cognito User Pool', () => {
    expectCDK(stack).to(
      haveResource('AWS::Cognito::UserPool', { UserPoolName: `pecuniary_user_pool_${props.envName}` })
    );
    expectCDK(stack).to(haveResource('AWS::Cognito::UserPoolClient', { ClientName: 'pecuniary_user_client' }));
  });

  test('SQS Queues and SNS Topics', () => {
    expectCDK(stack).to(
      haveResource('AWS::SQS::Queue', { QueueName: `pecuniary-commandHandler-DeadLetterQueue-${props.envName}` })
    );
    expectCDK(stack).to(
      haveResource('AWS::SQS::Queue', { QueueName: `pecuniary-eventBus-DeadLetterQueue-${props.envName}` })
    );
    expectCDK(stack).to(
      haveResource('AWS::SQS::Queue', { QueueName: `pecuniary-eventHandler-DeadLetterQueue-${props.envName}` })
    );
    expectCDK(stack).to(
      haveResource('AWS::SNS::Topic', { TopicName: `pecuniary-commandHandler-Topic-${props.envName}` })
    );
    expectCDK(stack).to(haveResource('AWS::SNS::Topic', { TopicName: `pecuniary-eventBus-Topic-${props.envName}` }));
    expectCDK(stack).to(
      haveResource('AWS::SNS::Topic', { TopicName: `pecuniary-eventHandler-Topic-${props.envName}` })
    );
    expectCDK(stack).to(haveResource('AWS::SNS::Subscription', { Protocol: 'email' }));
  });

  test('CloudWatch Alarms', () => {
    expectCDK(stack).to(
      haveResource('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 2,
        AlarmName: `pecuniary-commandHandler-Alarm-${props.envName}`,
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
        AlarmName: `pecuniary-eventBus-Alarm-${props.envName}`,
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
        AlarmName: `pecuniary-eventHandler-Alarm-${props.envName}`,
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
      haveResource('AWS::AppSync::GraphQLApi', {
        AuthenticationType: 'API_KEY',
        Name: `pecuniary-api-${props.envName}`,
      })
    );
    expectCDK(stack).to(haveResource('AWS::AppSync::GraphQLSchema'));
    expectCDK(stack).to(haveResource('AWS::AppSync::ApiKey'));
    expectCDK(stack).to(haveResource('AWS::AppSync::DataSource'));
    expectCDK(stack).to(haveResource('AWS::AppSync::Resolver'));
  });

  test('DynamoDB Tables', () => {
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-Event-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-AccountType-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-CurrencyType-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-ExchangeType-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-TransactionType-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-AccountReadModel-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-PositionReadModel-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-TransactionReadModel-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::DynamoDB::Table', {
        TableName: `pecuniary-TimeSeries-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
  });

  test('EventBridge Events', () => {
    expectCDK(stack).to(haveResource('AWS::Events::EventBus', { Name: `pecuniary-bus-${props.envName}` }));
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: `pecuniary-AccountCreatedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountCreatedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: `pecuniary-AccountUpdatedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountUpdatedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: `pecuniary-AccountDeletedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountDeletedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: `pecuniary-TransactionCreatedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionCreatedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: `pecuniary-TransactionUpdatedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionUpdatedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: `pecuniary-TransactionDeletedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionDeletedEvent'],
        },
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Events::Rule', {
        Name: `pecuniary-TransactionSavedEvent-${props.envName}`,
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
        FunctionName: `pecuniary-CommandHandler-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-EventBus-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    //expectCDK(stack).to(haveResource('AWS::Lambda::EventSourceMapping'));
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-createAccount-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-updateAccount-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-deleteAccount-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-createTransaction-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-updateTransaction-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-deleteTransaction-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-createUpdatePosition-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', {
        FunctionName: `pecuniary-updateAccountValues-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
  });
});

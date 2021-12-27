import { PecuniaryStackProps } from './../lib/PecuniaryStackProps';
import { Capture, Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
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
    },
  };
  const stack = new Pecuniary.PecuniaryStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('Cognito User Pool', () => {
    template.hasResourceProperties(
      'AWS::Cognito::UserPool',
      Match.objectLike({ UserPoolName: `pecuniary_user_pool_${props.envName}` })
    );
    template.hasResourceProperties(
      'AWS::Cognito::UserPoolClient',
      Match.objectLike({ ClientName: 'pecuniary_user_client' })
    );
  });

  test('SQS Queues and SNS Topics', () => {
    template.hasResourceProperties(
      'AWS::SQS::Queue',
      Match.objectLike({ QueueName: `pecuniary-commandHandler-DeadLetterQueue-${props.envName}` })
    );
    template.hasResourceProperties(
      'AWS::SQS::Queue',
      Match.objectLike({ QueueName: `pecuniary-eventBus-DeadLetterQueue-${props.envName}` })
    );
    template.hasResourceProperties(
      'AWS::SQS::Queue',
      Match.objectLike({ QueueName: `pecuniary-eventHandler-DeadLetterQueue-${props.envName}` })
    );
    template.hasResourceProperties(
      'AWS::SNS::Topic',
      Match.objectLike({ TopicName: `pecuniary-commandHandler-Topic-${props.envName}` })
    );
    template.hasResourceProperties(
      'AWS::SNS::Topic',
      Match.objectLike({ TopicName: `pecuniary-eventBus-Topic-${props.envName}` })
    );
    template.hasResourceProperties(
      'AWS::SNS::Topic',
      Match.objectLike({ TopicName: `pecuniary-eventHandler-Topic-${props.envName}` })
    );
    template.hasResourceProperties('AWS::SNS::Subscription', Match.objectLike({ Protocol: 'email' }));
  });

  test('CloudWatch Alarms', () => {
    template.hasResourceProperties(
      'AWS::CloudWatch::Alarm',
      Match.objectLike({
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 2,
        AlarmName: `pecuniary-commandHandler-Alarm-${props.envName}`,
        DatapointsToAlarm: 1,
        MetricName: 'NumberOfMessagesSent',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Average',
        Threshold: 1,
      })
    );

    template.hasResourceProperties(
      'AWS::CloudWatch::Alarm',
      Match.objectLike({
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 2,
        AlarmName: `pecuniary-eventBus-Alarm-${props.envName}`,
        DatapointsToAlarm: 1,
        MetricName: 'NumberOfMessagesSent',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Average',
        Threshold: 1,
      })
    );

    template.hasResourceProperties(
      'AWS::CloudWatch::Alarm',
      Match.objectLike({
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 2,
        AlarmName: `pecuniary-eventHandler-Alarm-${props.envName}`,
        DatapointsToAlarm: 1,
        MetricName: 'NumberOfMessagesSent',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Average',
        Threshold: 1,
      })
    );
  });

  test('AppSync GraphQL APIs', () => {
    template.hasResourceProperties(
      'AWS::AppSync::GraphQLApi',
      Match.objectLike({
        AuthenticationType: 'API_KEY',
        Name: `pecuniary-api-${props.envName}`,
      })
    );
    // TODO Add more asserts
    template.hasResourceProperties('AWS::AppSync::GraphQLSchema', Match.objectLike({}));
    template.hasResourceProperties('AWS::AppSync::ApiKey', Match.objectLike({}));
    template.hasResourceProperties('AWS::AppSync::DataSource', Match.objectLike({}));
    template.hasResourceProperties('AWS::AppSync::Resolver', Match.objectLike({}));
  });

  test('DynamoDB Tables', () => {
    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-Event-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-AccountType-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-CurrencyType-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-ExchangeType-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-TransactionType-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-AccountReadModel-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-PositionReadModel-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-TransactionReadModel-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );

    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-TimeSeries-${props.envName}`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
  });

  test('EventBridge Events', () => {
    template.hasResourceProperties(
      'AWS::Events::EventBus',
      Match.objectLike({ Name: `pecuniary-bus-${props.envName}` })
    );

    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-AccountCreatedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountCreatedEvent'],
        },
      })
    );

    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-AccountUpdatedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountUpdatedEvent'],
        },
      })
    );

    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-AccountDeletedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['AccountDeletedEvent'],
        },
      })
    );

    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-TransactionCreatedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionCreatedEvent'],
        },
      })
    );

    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-TransactionUpdatedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionUpdatedEvent'],
        },
      })
    );

    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-TransactionDeletedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionDeletedEvent'],
        },
      })
    );

    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-TransactionSavedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['TransactionSavedEvent'],
        },
      })
    );
  });

  test('Lambda Functions', () => {
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-CommandHandler-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-EventBus-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    //template.hasResourceProperties('AWS::Lambda::EventSourceMapping'));

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-createAccount-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-updateAccount-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-deleteAccount-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-createTransaction-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-updateTransaction-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-deleteTransaction-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-createUpdatePosition-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-updateAccountValues-${props.envName}`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
  });
});

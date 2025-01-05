import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { PecuniaryApiStackProps } from '../../lib/types/PecuniaryStackProps';
import { ApiStack } from '../../lib/api-stack';

describe('Api Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: PecuniaryApiStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    params: {
      dlqNotifications: 'test@test.com',
      userPoolId: 'id',
      dataTableArn: 'arn:aws:dynamodb:us-east-1:123456789012:table/mockTable',
    },
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  const stack = new ApiStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('should have SQS Queues and SNS Topics', () => {
    template.hasResourceProperties('AWS::SQS::Queue', Match.objectLike({ QueueName: `pecuniary-${props.envName}-updateBankAccountDLQ` }));
    template.hasResourceProperties(
      'AWS::SQS::Queue',
      Match.objectLike({ QueueName: `pecuniary-${props.envName}-updateInvestmentAccountDLQ` })
    );
    template.hasResourceProperties('AWS::SNS::Topic', Match.objectLike({ TopicName: `pecuniary-${props.envName}-updateBankAccountTopic` }));
    template.hasResourceProperties(
      'AWS::SNS::Topic',
      Match.objectLike({ TopicName: `pecuniary-${props.envName}-updateInvestmentAccountTopic` })
    );
    template.hasResourceProperties('AWS::SNS::Subscription', Match.objectLike({ Protocol: 'email' }));

    template.hasResourceProperties(
      'AWS::CloudWatch::Alarm',
      Match.objectLike({
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 1,
        AlarmName: `pecuniary-${props.envName}-updateBankAccountAlarm`,
        DatapointsToAlarm: 1,
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Sum',
        Threshold: 1,
      })
    );
    template.hasResourceProperties(
      'AWS::CloudWatch::Alarm',
      Match.objectLike({
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 1,
        AlarmName: `pecuniary-${props.envName}-updateInvestmentAccountAlarm`,
        DatapointsToAlarm: 1,
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Sum',
        Threshold: 1,
      })
    );
  });

  test('should have EventBridge', () => {
    template.hasResourceProperties('AWS::Events::EventBus', Match.objectLike({ Name: `pecuniary-bus-${props.envName}` }));
  });

  test('should have AppSync GraphQL API', () => {
    template.hasResourceProperties(
      'AWS::AppSync::GraphQLApi',
      Match.objectLike({
        AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
        Name: `pecuniary-${props.envName}-api`,
      })
    );
    // TODO Add more asserts
    template.hasResourceProperties('AWS::AppSync::GraphQLSchema', Match.objectLike({}));
    template.hasResourceProperties('AWS::AppSync::DataSource', Match.objectLike({}));
    template.hasResourceProperties('AWS::AppSync::Resolver', Match.objectLike({}));
  });

  test('should have AppSync JS Resolvers', () => {
    template.hasResourceProperties(
      'AWS::AppSync::FunctionConfiguration',
      Match.objectLike({
        Name: 'createAccount',
        DataSourceName: 'dynamoDBDataSource',
        Runtime: {
          Name: 'APPSYNC_JS',
          RuntimeVersion: '1.0.0',
        },
      })
    );
    template.hasResourceProperties(
      'AWS::AppSync::FunctionConfiguration',
      Match.objectLike({
        Name: 'updateAccount',
        DataSourceName: 'dynamoDBDataSource',
        Runtime: {
          Name: 'APPSYNC_JS',
          RuntimeVersion: '1.0.0',
        },
      })
    );
    template.hasResourceProperties(
      'AWS::AppSync::FunctionConfiguration',
      Match.objectLike({
        Name: 'getAccount',
        DataSourceName: 'dynamoDBDataSource',
        Runtime: {
          Name: 'APPSYNC_JS',
          RuntimeVersion: '1.0.0',
        },
      })
    );
    template.hasResourceProperties(
      'AWS::AppSync::FunctionConfiguration',
      Match.objectLike({
        Name: 'getAccounts',
        DataSourceName: 'dynamoDBDataSource',
        Runtime: {
          Name: 'APPSYNC_JS',
          RuntimeVersion: '1.0.0',
        },
      })
    );
    template.hasResourceProperties(
      'AWS::AppSync::FunctionConfiguration',
      Match.objectLike({
        Name: 'getAggregate',
        DataSourceName: 'dynamoDBDataSource',
        Runtime: {
          Name: 'APPSYNC_JS',
          RuntimeVersion: '1.0.0',
        },
      })
    );
    template.hasResourceProperties(
      'AWS::AppSync::FunctionConfiguration',
      Match.objectLike({
        Name: 'deleteAccount',
        DataSourceName: 'dynamoDBDataSource',
        Runtime: {
          Name: 'APPSYNC_JS',
          RuntimeVersion: '1.0.0',
        },
      })
    );
  });

  test('should have EventBridge Rules', () => {
    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-BankTransactionSavedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['BankTransactionSavedEvent'],
        },
      })
    );
    template.hasResourceProperties(
      'AWS::Events::Rule',
      Match.objectLike({
        Name: `pecuniary-InvestmentTransactionSavedEvent-${props.envName}`,
        EventPattern: {
          source: ['custom.pecuniary'],
          'detail-type': ['InvestmentTransactionSavedEvent'],
        },
      })
    );
  });

  test('should have Lambda Functions', () => {
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-UpdateBankAccount`,
        Handler: 'index.handler',
        Runtime: 'nodejs22.x',
      })
    );
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-UpdateInvestmentAccount`,
        Handler: 'index.handler',
        Runtime: 'nodejs22.x',
      })
    );
  });
});

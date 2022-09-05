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
      userPoolId: 'test',
    },
  };
  const stack = new Pecuniary.PecuniaryStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('Cognito User Pool', () => {
    template.hasResourceProperties('AWS::Cognito::UserPool', Match.objectLike({ UserPoolName: `pecuniary_user_pool_${props.envName}` }));
    template.hasResourceProperties('AWS::Cognito::UserPoolClient', Match.objectLike({ ClientName: 'pecuniary_user_client' }));
  });

  test('SQS Queues and SNS Topics', () => {
    template.hasResourceProperties(
      'AWS::SQS::Queue',
      Match.objectLike({ QueueName: `pecuniary-eventHandler-DeadLetterQueue-${props.envName}` })
    );
    template.hasResourceProperties('AWS::SNS::Topic', Match.objectLike({ TopicName: `pecuniary-eventHandler-Topic-${props.envName}` }));
    template.hasResourceProperties('AWS::SNS::Subscription', Match.objectLike({ Protocol: 'email' }));

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
        AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
        Name: `pecuniary-${props.envName}-api`,
      })
    );
    // TODO Add more asserts
    template.hasResourceProperties('AWS::AppSync::GraphQLSchema', Match.objectLike({}));
    template.hasResourceProperties('AWS::AppSync::DataSource', Match.objectLike({}));
    template.hasResourceProperties('AWS::AppSync::Resolver', Match.objectLike({}));
  });

  test('DynamoDB Tables', () => {
    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-${props.envName}-Data`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
  });

  test('EventBridge Events', () => {
    template.hasResourceProperties('AWS::Events::EventBus', Match.objectLike({ Name: `pecuniary-bus-${props.envName}` }));

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
        FunctionName: `pecuniary-${props.envName}-CognitoPostConfirmationTrigger`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-AccountsResolver`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-TransactionsResolver`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-PositionsResolver`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-UpdatePositions`,
        Handler: 'main.handler',
        Runtime: 'nodejs14.x',
      })
    );
  });
});

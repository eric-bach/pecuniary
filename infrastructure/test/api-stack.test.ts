import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { PecuniaryApiStackProps } from '../lib/types/PecuniaryStackProps';
import { ApiStack } from '../lib/api-stack';

describe('Api Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: PecuniaryApiStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    params: {
      userPoolId: 'id',
      dataTableArn: 'arn:aws:dynamodb:us-east-1:123456789012:table/mockTable',
      eventBusArn: 'arn:aws:events:us-east-1:123456789012:event-bus/mockEventBus',
      eventHandlerQueueArn: 'arn:aws:sqs:us-east-1:123456789012:mockQueue',
    },
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  const stack = new ApiStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

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
        Name: 'deleteAggregate',
        DataSourceName: 'dynamoDBDataSource',
        Runtime: {
          Name: 'APPSYNC_JS',
          RuntimeVersion: '1.0.0',
        },
      })
    );
  });

  // test('should have EventBridge Rules', () => {
  //   template.hasResourceProperties(
  //     'AWS::Events::Rule',
  //     Match.objectLike({
  //       Name: `pecuniary-TransactionSavedEvent-${props.envName}`,
  //       EventPattern: {
  //         source: ['custom.pecuniary'],
  //         'detail-type': ['TransactionSavedEvent'],
  //       },
  //     })
  //   );
  // });

  // test('should have Lambda Functions', () => {
  //   template.hasResourceProperties(
  //     'AWS::Lambda::Function',
  //     Match.objectLike({
  //       FunctionName: `pecuniary-${props.envName}-AccountsResolver`,
  //       Handler: 'index.handler',
  //       Runtime: 'nodejs18.x',
  //     })
  //   );
  //   template.hasResourceProperties(
  //     'AWS::Lambda::Function',
  //     Match.objectLike({
  //       FunctionName: `pecuniary-${props.envName}-TransactionsResolver`,
  //       Handler: 'index.handler',
  //       Runtime: 'nodejs18.x',
  //     })
  //   );
  //   template.hasResourceProperties(
  //     'AWS::Lambda::Function',
  //     Match.objectLike({
  //       FunctionName: `pecuniary-${props.envName}-PositionsResolver`,
  //       Handler: 'index.handler',
  //       Runtime: 'nodejs18.x',
  //     })
  //   );
  //   template.hasResourceProperties(
  //     'AWS::Lambda::Function',
  //     Match.objectLike({
  //       FunctionName: `pecuniary-${props.envName}-UpdatePositions`,
  //       Handler: 'index.handler',
  //       Runtime: 'nodejs18.x',
  //     })
  //   );
  // });
});

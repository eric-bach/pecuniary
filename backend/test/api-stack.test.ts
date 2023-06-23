import { Match, Template } from 'aws-cdk-lib/assertions';
import { PecuniaryApiStackProps } from '../lib/types/PecuniaryStackProps';
import { ApiStack } from '../lib/api-stack';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { App } from 'aws-cdk-lib';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { EventBus } from 'aws-cdk-lib/aws-events';

describe('Api Stack contains expected resources', () => {
  const app = new App();

  const props: PecuniaryApiStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    params: {
      userPoolId: 'id',
      dataTableArn: 'arn',
      eventBusArn: 'arn',
      eventHandlerQueueArn: 'arn',
    },
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  process.env.CERTIFICATE_ARN = 'test';
  process.env.DLQ_NOTIFICATIONS = 'test';

  const fromTableArnMock = jest.spyOn(Table, 'fromTableArn');
  const fromQueueArn = jest.spyOn(Queue, 'fromQueueArn');
  const fromEventBusArn = jest.spyOn(EventBus, 'fromEventBusArn');
  fromTableArnMock.mockReturnValue({ tableName: 'test', tableArn: 'arn:aws:DynamoDB:::test' } as Table);
  fromQueueArn.mockReturnValue({ queueArn: 'arn:aws:SQS:::test' } as Queue);
  fromEventBusArn.mockReturnValue({ eventBusName: 'test', eventBusArn: 'arn:aws:Events:::test' } as EventBus);

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

  test('should have EventBridge Rules', () => {
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

  test('should have Lambda Functions', () => {
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-AccountsResolver`,
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
      })
    );
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-TransactionsResolver`,
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
      })
    );
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-PositionsResolver`,
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
      })
    );
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-UpdatePositions`,
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
      })
    );
  });
});

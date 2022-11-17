import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { ApiStack } from '../lib/api-stack';
import { PecuniaryApiStackProps } from '../lib/types/PecuniaryStackProps';

describe('Api Stack contains expected resources', () => {
  const app = new App();

  const props: PecuniaryApiStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    params: {
      dataTableArn: 'arn',
    },
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  const fromTableArnMock = jest.spyOn(Table, 'fromTableArn');
  const fromQueueArn = jest.spyOn(Queue, 'fromQueueArn');
  const fromEventBusArn = jest.spyOn(EventBus, 'fromEventBusArn');
  fromTableArnMock.mockReturnValue({ tableName: 'test', tableArn: 'arn:aws:DynamoDB:::test' } as Table);
  fromQueueArn.mockReturnValue({ queueArn: 'arn:aws:SQS:::test' } as Queue);
  fromEventBusArn.mockReturnValue({ eventBusName: 'test', eventBusArn: 'arn:aws:Events:::test' } as EventBus);

  const stack = new ApiStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('should have Lambda Functions', () => {
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-AccountsResolver`,
        Handler: 'index.handler',
        Runtime: 'nodejs14.x',
      })
    );
  });
});
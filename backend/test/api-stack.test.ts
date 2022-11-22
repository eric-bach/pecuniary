import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { ApiStack } from '../lib/api-stack';
import { ApiStackProps } from '../lib/types/StackProps';

describe('Api Stack contains expected resources', () => {
  const app = new App();

  const props: ApiStackProps = {
    appName: 'vietaws-meetup-10-cdk',
    envName: 'dev',
    params: {
      ordersTableArn: 'arn',
    },
    tags: {
      env: 'dev',
      application: 'vietaws-meetup-10-cdk',
    },
  };

  const fromTableArnMock = jest.spyOn(Table, 'fromTableArn');
  fromTableArnMock.mockReturnValue({ tableName: 'test', tableArn: 'arn:aws:DynamoDB:::test' } as Table);

  const stack = new ApiStack(app, 'TestStack', props);

  const template = Template.fromStack(stack);

  test('should have Lambda Functions', () => {
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `${props.appName}-${props.envName}-orders-api`,
        Handler: 'index.handler',
        Runtime: 'nodejs14.x',
      })
    );
  });
});
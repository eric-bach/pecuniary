import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { PecuniaryBaseStackProps } from '../lib/types/PecuniaryStackProps';
import { DatabaseStack } from '../lib/database-stack';

describe('Database Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: PecuniaryBaseStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  process.env.CERTIFICATE_ARN = 'test';
  process.env.DLQ_NOTIFICATIONS = 'test';

  const stack = new DatabaseStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('should have DynamoDB Table', () => {
    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-Data`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
  });
});

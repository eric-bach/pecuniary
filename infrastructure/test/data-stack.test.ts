import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { PecuniaryBaseStackProps } from '../lib/types/PecuniaryStackProps';
import { DataStack } from '../lib/data-stack';

describe('Data Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: PecuniaryBaseStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  const stack = new DataStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('should have Cognito User Pool', () => {
    template.hasResourceProperties('AWS::Cognito::UserPool', Match.objectLike({ UserPoolName: `pecuniary_user_pool_${props.envName}` }));
    template.hasResourceProperties('AWS::Cognito::UserPoolClient', Match.objectLike({ ClientName: 'pecuniary_user_client' }));
  });

  test('should have Post Confirmation Trigger function', () => {
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        FunctionName: `pecuniary-${props.envName}-CognitoPostConfirmationTrigger`,
        Handler: 'index.handler',
        Runtime: 'nodejs22.x',
      })
    );
  });

  test('should have DynamoDB Table', () => {
    template.hasResourceProperties(
      'AWS::DynamoDB::Table',
      Match.objectLike({
        TableName: `pecuniary-data-dev`,
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
  });
});

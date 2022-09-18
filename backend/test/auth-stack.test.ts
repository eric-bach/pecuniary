import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { AuthStack } from '../lib/auth-stack';
import { PecuniaryBaseStackProps } from '../lib/types/PecuniaryStackProps';

describe('Auth Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: PecuniaryBaseStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  const stack = new AuthStack(app, 'PecuniaryTestStack', props);

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
        Runtime: 'nodejs14.x',
      })
    );
  });
});

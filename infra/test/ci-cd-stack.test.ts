import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { GitHubStackProps } from '../lib/types/PecuniaryStackProps';
import { CiCdStack } from '../lib/ci-cd-stack';

describe('CI/CD Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: GitHubStackProps = {
    repositoryConfig: [
      {
        owner: 'test',
        repo: 'test',
      },
    ],
  };

  const stack = new CiCdStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('should have GitHub Actions role', () => {
    template.hasResourceProperties('AWS::IAM::Role', Match.objectLike({ RoleName: 'GitHubActionsDeployRole' }));
  });
});

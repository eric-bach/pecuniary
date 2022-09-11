import { Stack, Duration, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OpenIdConnectProvider, Role, WebIdentityPrincipal, ManagedPolicy, Conditions } from 'aws-cdk-lib/aws-iam';
import { GitHubStackProps } from './types/PecuniaryStackProps';

export class CiCdStack extends Stack {
  constructor(scope: Construct, id: string, props: GitHubStackProps) {
    super(scope, id, props);

    const githubDomain = 'token.actions.githubusercontent.com';

    const iamRepoDeployAccess = props.repositoryConfig.map((r) => `repo:${r.owner}/${r.repo}:${r.filter ?? '*'}`);

    // grant only requests coming from a specific GitHub repository.
    const conditions: Conditions = {
      StringLike: {
        [`${githubDomain}:sub`]: iamRepoDeployAccess,
      },
    };

    const ghProvider = new OpenIdConnectProvider(this, 'githubProvider', {
      url: `https://${githubDomain}`,
      clientIds: ['sts.amazonaws.com'],
    });

    new Role(this, 'GitHubActionsDeployRole', {
      assumedBy: new WebIdentityPrincipal(ghProvider.openIdConnectProviderArn, conditions),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
      roleName: 'GitHubActionsDeployRole',
      description: 'This role is used via GitHub Actions to deploy with CDK on the target AWS account',
      maxSessionDuration: Duration.hours(1),
    });
  }
}

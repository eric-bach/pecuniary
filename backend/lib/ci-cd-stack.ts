import { Stack, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OpenIdConnectProvider, Role, WebIdentityPrincipal, ManagedPolicy, Conditions } from 'aws-cdk-lib/aws-iam';
import { GitHubStackProps } from './types/StackProps';

export class CiCdStack extends Stack {
  constructor(scope: Construct, id: string, props: GitHubStackProps) {
    super(scope, id, props);

    const githubDomain = 'token.actions.githubusercontent.com';
    const iamRepoDeployAccess = props.repositoryConfig.map((r) => `repo:${r.owner}/${r.repo}:${r.filter ?? '*'}`);

    // Grant only requests coming from a specific GitHub repository
    const conditions: Conditions = {
      StringLike: {
        [`${githubDomain}:sub`]: iamRepoDeployAccess,
      },
    };

    const githubProvider = new OpenIdConnectProvider(this, 'githubProvider', {
      url: `https://${githubDomain}`,
      clientIds: ['sts.amazonaws.com'],
    });

    const actionsRole = new Role(this, 'GitHubActionsDeployRole', {
      assumedBy: new WebIdentityPrincipal(githubProvider.openIdConnectProviderArn, conditions),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
      roleName: 'GitHubActionsDeployRole',
      description: 'This role is used via GitHub Actions to deploy with CDK on the target AWS account',
      maxSessionDuration: Duration.hours(1),
    });

    new CfnOutput(this, 'GitHubActionsRoleArn', {
      value: actionsRole.roleArn,
    });
  }
}

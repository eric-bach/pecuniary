import { StackProps } from 'aws-cdk-lib';

export interface BaseStackProps extends StackProps {
  appName: string;
  envName: string;
}

export interface FrontendStackProps extends BaseStackProps {
  params: {
    certificateArn: string;
  };
}

export interface ApiStackProps extends BaseStackProps {
  params: {
    ordersTableArn: string;
  };
}

export interface GitHubStackProps extends StackProps {
  readonly repositoryConfig: { owner: string; repo: string; filter?: string }[];
}

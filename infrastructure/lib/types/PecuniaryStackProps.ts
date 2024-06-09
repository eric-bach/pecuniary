import { StackProps } from 'aws-cdk-lib';

export interface PecuniaryBaseStackProps extends StackProps {
  appName: string;
  envName: string;
}

export interface PecuniaryApiStackProps extends PecuniaryBaseStackProps {
  params: {
    dlqNotifications: string;
    userPoolId: string;
    dataTableArn: string;
  };
}

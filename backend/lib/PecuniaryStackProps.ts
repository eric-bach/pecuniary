import { StackProps } from 'aws-cdk-lib';

export interface PecuniaryStackProps extends StackProps {
  appName: string;
  envName: string;
  params: {
    certificateArn: string;
    dlqNotifications?: string;
  };
}

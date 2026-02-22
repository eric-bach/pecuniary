import { StackProps } from 'aws-cdk-lib';

export interface PecuniaryBaseStackProps extends StackProps {
  appName: string;
  envName: string;
}

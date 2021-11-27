import { StackProps } from '@aws-cdk/core';

export interface PecuniaryStackProps extends StackProps {
  appName: string;
  envName: string;
  params: {
    alphaVantageApiKey: string;
    dlqNotifications: string;
  };
}

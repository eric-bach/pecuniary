import { StackProps } from 'aws-cdk-lib';

export interface PecuniaryStackProps extends StackProps {
  appName: string;
  envName: string;
  params: {
    certificateArn: string;
    dlqNotifications?: string;
    userPoolId: string;
    dataTableArn: string;
    dataTableName: string;
    eventHandlerQueueArn: string;
    eventBusArn: string;
    eventBusName: string;
  };
}

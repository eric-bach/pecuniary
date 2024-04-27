import { StackProps } from 'aws-cdk-lib';

export interface PecuniaryBaseStackProps extends StackProps {
  appName: string;
  envName: string;
}

export interface PecuniaryMessagingStackProps extends PecuniaryBaseStackProps {
  params: {
    dlqNotifications: string;
  };
}

export interface PecuniaryApiStackProps extends PecuniaryBaseStackProps {
  params: {
    userPoolId: string;
    dataTableArn: string;
    eventHandlerQueueArn: string;
    eventBusArn: string;
  };
}

export interface PecuniaryFrontendStackProps extends PecuniaryBaseStackProps {
  params: {
    certificateArn: string;
  };
}

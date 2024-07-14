#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { ApiStack } from '../lib/api-stack';
import { DataStack } from '../lib/data-stack';
import { PecuniaryBaseStackProps } from '../lib/types/PecuniaryStackProps';

const APP_NAME = 'pecuniary';

const app = new App();

const envName = app.node.tryGetContext('env');
const stage = app.node.tryGetContext('stage');

const baseProps: PecuniaryBaseStackProps = {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  appName: APP_NAME,
  envName: envName,
  tags: {
    environment: envName,
    application: APP_NAME,
  },
};

switch (stage) {
  case 'backend': {
    // Stateful resources
    const data = new DataStack(app, `${APP_NAME}-data-${envName}`, baseProps);

    // Stateless resources
    new ApiStack(app, `${APP_NAME}-api-${envName}`, {
      ...baseProps,
      params: {
        dlqNotifications: process.env.DLQ_NOTIFICATIONS ?? '',
        userPoolId: data.userPoolId,
        dataTableArn: data.dataTableArn,
      },
    });

    break;
  }

  case 'frontend': {
    // Next.js frontend deployed by Amplify Console
    break;
  }
}

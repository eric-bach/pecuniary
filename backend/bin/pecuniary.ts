#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AuthStack } from '../lib/auth-stack';
import { PecuniaryStack } from '../lib/pecuniary-stack';

const app = new App();

const envName = app.node.tryGetContext('env');
const deployStage = app.node.tryGetContext('deployStage');

switch (deployStage) {
  case 'backend': {
    const auth = new AuthStack(app, `pecuniary-auth-${envName}`, {
      appName: 'pecuniary',
      envName: envName,
      tags: {
        env: envName,
        application: 'pecuniary',
      },
      params: {
        certificateArn: process.env.CERTIFICATE_ARN ?? '',
        dlqNotifications: process.env.DLQ_NOTIFICATIONS,
        userPoolId: '',
      },
    });

    new PecuniaryStack(app, `pecuniary-${envName}`, {
      appName: 'pecuniary',
      envName: envName,
      tags: {
        env: envName,
        application: 'pecuniary',
      },
      params: {
        certificateArn: process.env.CERTIFICATE_ARN ?? '',
        dlqNotifications: process.env.DLQ_NOTIFICATIONS,
        userPoolId: auth.userPoolId,
      },
    });
  }
  case 'frontend': {
    // TODO Add Here
  }
}

// new PecuniaryStack(app, 'pecuniary-prod', {
//   appName: 'pecuniary',
//   envName: 'prod',
//   env: { account: process.env.CDK_PROD_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
//   tags: {
//     env: 'prod',
//     application: 'pecuniary',
//   },
//   params: {
//     certificateArn: process.env.CERTIFICATE_ARN ?? '',
//     dlqNotifications: process.env.DLQ_NOTIFICATIONS,
//     userPoolId: auth.userPoolId,
//   },
// });

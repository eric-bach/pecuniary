#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { PecuniaryStack } from '../lib/pecuniary-stack';

const app = new App();

new PecuniaryStack(app, 'pecuniary-dev', {
  appName: 'pecuniary',
  envName: 'dev',
  env: { account: process.env.CDK_DEV_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  tags: {
    env: 'dev',
    application: 'pecuniary',
  },
  params: {
    certificateArn: process.env.CERTIFICATE_ARN ?? '',
    dlqNotifications: process.env.DLQ_NOTIFICATIONS,
  },
});

new PecuniaryStack(app, 'pecuniary-prod', {
  appName: 'pecuniary',
  envName: 'prod',
  env: { account: process.env.CDK_PROD_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  tags: {
    env: 'prod',
    application: 'pecuniary',
  },
  params: {
    certificateArn: process.env.CERTIFICATE_ARN ?? '',
    dlqNotifications: process.env.DLQ_NOTIFICATIONS,
  },
});

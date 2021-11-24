#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
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
    alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY ?? '',
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
    alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY ?? '',
    dlqNotifications: process.env.DLQ_NOTIFICATIONS,
  },
});

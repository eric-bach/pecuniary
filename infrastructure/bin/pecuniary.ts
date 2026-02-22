#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { DataStack } from '../lib/data-stack';
import { PecuniaryBaseStackProps } from '../types/PecuniaryStackProps';

const APP_NAME = 'pecuniary';

const app = new App();

const envName = app.node.tryGetContext('env');

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

new DataStack(app, `${APP_NAME}-data-${envName}`, baseProps);

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RemixStack } from '../lib/remix-stack';

const app = new cdk.App();
new RemixStack(app, 'pecuniary-remix', {
  env: { region: 'us-east-1' },
});

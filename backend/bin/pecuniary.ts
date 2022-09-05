#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AuthStack } from '../lib/auth-stack';
import { ApiStack } from '../lib/api-stack';
import { DatabaseStack } from '../lib/database-stack';
import { MessagingStack } from '../lib/messaging-stack';
import { FrontendStack } from '../lib/frontend-stack';

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
        dataTableArn: '',
        dataTableName: '',
        eventHandlerQueueArn: '',
        eventBusArn: '',
        eventBusName: '',
      },
    });

    const database = new DatabaseStack(app, `pecuniary-database-${envName}`, {
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
        dataTableArn: '',
        dataTableName: '',
        eventHandlerQueueArn: '',
        eventBusArn: '',
        eventBusName: '',
      },
    });

    const messaging = new MessagingStack(app, `pecuniary-messaging-${envName}`, {
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
        dataTableArn: '',
        dataTableName: '',
        eventHandlerQueueArn: '',
        eventBusArn: '',
        eventBusName: '',
      },
    });

    new ApiStack(app, `pecuniary-api-${envName}`, {
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
        dataTableArn: database.dataTableArn,
        dataTableName: database.dataTableName,
        eventHandlerQueueArn: messaging.eventHandlerQueueArn,
        eventBusArn: messaging.eventBusArn,
        eventBusName: messaging.eventBusName,
      },
    });
  }
  case 'frontend': {
    new FrontendStack(app, `pecuniary-frontend-${envName}`, {
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
        dataTableArn: '',
        dataTableName: '',
        eventHandlerQueueArn: '',
        eventBusArn: '',
        eventBusName: '',
      },
    });
  }
}

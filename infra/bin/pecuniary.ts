#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AuthStack } from '../lib/auth-stack';
import { ApiStack } from '../lib/api-stack';
import { DatabaseStack } from '../lib/database-stack';
import { MessagingStack } from '../lib/messaging-stack';
import { FrontendStack } from '../lib/frontend-stack';
import { GitHubStackProps, PecuniaryBaseStackProps } from '../lib/types/PecuniaryStackProps';
import { MfeStack } from '../lib/mfe-stack';
import { CiCdStack } from '../lib/ci-cd-stack';

const app = new App();

const envName = app.node.tryGetContext('env');
const stage = app.node.tryGetContext('stage');

const baseProps: PecuniaryBaseStackProps = {
  env: {
    region: process.env.CDK_DEFAULT_REGION ?? '',
    account: process.env.CDK_DEFAULT_ACCOUNT ?? '',
  },
  appName: 'pecuniary',
  envName: envName,
  tags: {
    environment: envName,
    application: 'pecuniary',
  },
};

switch (stage) {
  case 'cicd': {
    const gitHubProps: GitHubStackProps = {
      repositoryConfig: [
        {
          owner: 'eric-bach',
          repo: 'pecuniary',
        },
      ],
    };
    new CiCdStack(app, `pecuniary-cicd-${envName}`, { ...baseProps, ...gitHubProps });

    break;
  }

  case 'backend': {
    const auth = new AuthStack(app, `pecuniary-auth-${envName}`, baseProps);

    const database = new DatabaseStack(app, `pecuniary-database-${envName}`, baseProps);

    const messaging = new MessagingStack(app, `pecuniary-messaging-${envName}`, {
      ...baseProps,
      params: {
        dlqNotifications: process.env.DLQ_NOTIFICATIONS ?? 'test@test.com',
      },
    });

    new ApiStack(app, `pecuniary-api-${envName}`, {
      ...baseProps,
      params: {
        userPoolId: auth.userPoolId,
        dataTableArn: database.dataTableArn,
        eventHandlerQueueArn: messaging.eventHandlerQueueArn,
        eventBusArn: messaging.eventBusArn,
      },
    });

    break;
  }

  case 'frontend': {
    new FrontendStack(app, `pecuniary-frontend-${envName}`, {
      ...baseProps,
      params: {
        certificateArn: process.env.CERTIFICATE_ARN ?? 'not_an_arn',
      },
    });

    new MfeStack(app, `pecuniary-mfe-container-${envName}`, {
      ...baseProps,
      params: {
        certificateArn: process.env.CERTIFICATE_ARN ?? 'not_an_arn',
      },
    });

    break;
  }
}

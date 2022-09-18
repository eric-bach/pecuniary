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
import { APP_NAME, DEFAULT_VALUES } from '../lib/constants';

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
  case 'cicd': {
    const gitHubProps: GitHubStackProps = {
      repositoryConfig: [
        {
          owner: DEFAULT_VALUES.GITHUB_OWNER,
          repo: APP_NAME,
        },
      ],
    };
    new CiCdStack(app, `${APP_NAME}-cicd-${envName}`, { ...baseProps, ...gitHubProps });

    break;
  }

  case 'backend': {
    const auth = new AuthStack(app, `${APP_NAME}-auth-${envName}`, baseProps);

    const database = new DatabaseStack(app, `${APP_NAME}-database-${envName}`, baseProps);

    const messaging = new MessagingStack(app, `${APP_NAME}-messaging-${envName}`, {
      ...baseProps,
      params: {
        dlqNotifications: process.env.DLQ_NOTIFICATIONS ?? DEFAULT_VALUES.EMAIL,
      },
    });

    new ApiStack(app, `${APP_NAME}-api-${envName}`, {
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
    // new FrontendStack(app, `${APP_NAME}-frontend-${envName}`, {
    //   ...baseProps,
    //   params: {
    //     certificateArn: process.env.CERTIFICATE_ARN ?? 'not_an_arn',
    //   },
    // });

    new MfeStack(app, `${APP_NAME}-mfe-container-${envName}`, {
      ...baseProps,
      params: {
        certificateArn: process.env.CERTIFICATE_ARN ?? 'not_an_arn',
      },
    });

    break;
  }
}

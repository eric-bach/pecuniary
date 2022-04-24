import { Stack, CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import {
  UserPool,
  CfnUserPoolGroup,
  UserPoolClient,
  AccountRecovery,
  VerificationEmailStyle,
  UserPoolDomain,
} from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Policy, Effect, CanonicalUserPrincipal } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Alarm, Metric, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import { GraphqlApi, FieldLogLevel, AuthorizationType, Schema } from '@aws-cdk/aws-appsync-alpha';
import { Table, BillingMode, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Rule, EventBus } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { BucketDeployment, CacheControl, ServerSideEncryption, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { BlockPublicAccess, Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import {
  CloudFrontAllowedMethods,
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol,
  SSLMethod,
  ViewerCertificate,
} from 'aws-cdk-lib/aws-cloudfront';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';

const dotenv = require('dotenv');
import * as path from 'path';
import { PecuniaryStackProps } from './PecuniaryStackProps';
import VERIFICATION_EMAIL_TEMPLATE from './emails/verificationEmail';

dotenv.config();

export class PecuniaryStack extends Stack {
  constructor(scope: Construct, id: string, props: PecuniaryStackProps) {
    super(scope, id, props);

    const REGION = Stack.of(this).region;

    /***
     *** AWS Lambda - Cognito post-confirmation trigger
     ***/

    // AWS Cognito post-confirmation lambda function
    const cognitoPostConfirmationTrigger = new Function(this, 'CognitoPostConfirmationTrigger', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-${props.envName}-CognitoPostConfirmationTrigger`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'cognitoPostConfirmation')),
      memorySize: 768,
      timeout: Duration.seconds(5),
      environment: {
        REGION: REGION,
      },
    });

    /***
     *** AWS Cognito
     ***/

    // Cognito user pool
    const userPool = new UserPool(this, 'PecuniaryUserPool', {
      userPoolName: `${props.appName}_user_pool_${props.envName}`,
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: VerificationEmailStyle.LINK,
        emailSubject: 'Pecuniary - Verify your new account',
        emailBody: VERIFICATION_EMAIL_TEMPLATE,
      },
      autoVerify: {
        email: true,
      },
      signInAliases: {
        username: false,
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      lambdaTriggers: {
        postConfirmation: cognitoPostConfirmationTrigger,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Cognito user pool group
    const usersGroup = new CfnUserPoolGroup(this, 'PecuniaryUserGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'Users',
      description: 'Pecuniary Users',
    });

    // Cognito user pool domain
    const userPoolDomain = new UserPoolDomain(this, 'PecuniaryUserPoolDomain', {
      userPool: userPool,
      cognitoDomain: {
        domainPrefix: `${props.appName}-${props.envName}`,
      },
    });

    // Cognito user client
    const userPoolClient = new UserPoolClient(this, 'PecuniaryUserClient', {
      userPoolClientName: `${props.appName}_user_client`,
      accessTokenValidity: Duration.hours(8),
      idTokenValidity: Duration.hours(8),
      userPool,
    });

    // Add permissions to add user to Cognito User Pool
    cognitoPostConfirmationTrigger.role!.attachInlinePolicy(
      new Policy(this, 'userpool-policy', {
        statements: [
          new PolicyStatement({
            actions: ['cognito-idp:AdminAddUserToGroup'],
            resources: [userPool.userPoolArn],
          }),
        ],
      })
    );

    /***
     *** AWS SQS - Dead letter Queues
     ***/

    // Event handler DLQ
    const eventHandlerQueue = new Queue(this, 'EventHandlerQueue', {
      queueName: `${props.appName}-eventHandler-DeadLetterQueue-${props.envName}`,
    });

    /***
     *** AWS SNS - Topics
     ***/

    const eventHandlerTopic = new Topic(this, 'EventHandlerTopic', {
      topicName: `${props.appName}-eventHandler-Topic-${props.envName}`,
      displayName: 'Event Handler Topic',
    });
    if (props.params.dlqNotifications) {
      eventHandlerTopic.addSubscription(new EmailSubscription(props.params.dlqNotifications));
    }

    /***
     *** AWS CloudWatch - Alarms
     ***/

    // Generic metric
    const metric = new Metric({
      namespace: 'AWS/SQS',
      metricName: 'NumberOfMessagesSent',
    });
    // TODO Doesn't seem to work
    metric.with({
      statistic: 'Sum',
      period: Duration.seconds(300),
    });

    const eventHandlerAlarm = new Alarm(this, 'EventHandlerAlarm', {
      alarmName: `${props.appName}-eventHandler-Alarm-${props.envName}`,
      alarmDescription: 'One or more failed EventHandler messages',
      metric: metric,
      datapointsToAlarm: 1,
      evaluationPeriods: 2,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    eventHandlerAlarm.addAlarmAction(new SnsAction(eventHandlerTopic));

    /***
     *** AWS AppSync
     ***/

    const api = new GraphqlApi(this, 'PecuniaryApi', {
      name: `${props.appName}-${props.envName}-api`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      schema: Schema.fromAsset(path.join(__dirname, './graphql/schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      },
    });

    /***
     *** AWS DynamoDB
     ***/

    const dataTable = new Table(this, 'Data', {
      tableName: `${props.appName}-${props.envName}-Data`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    // LSIs for Data table
    dataTable.addLocalSecondaryIndex({
      indexName: 'aggregateId-lsi',
      sortKey: {
        name: 'aggregateId',
        type: AttributeType.STRING,
      },
    });
    dataTable.addLocalSecondaryIndex({
      indexName: 'entity-lsi',
      sortKey: {
        name: 'entity',
        type: AttributeType.STRING,
      },
    });
    dataTable.addLocalSecondaryIndex({
      indexName: 'transactionDate-lsi',
      sortKey: {
        name: 'transactionDate',
        type: AttributeType.STRING,
      },
    });
    // GSIs for Data Table
    dataTable.addGlobalSecondaryIndex({
      indexName: 'aggregateId-gsi',
      partitionKey: {
        name: 'aggregateId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
    });

    /***
     *** AWS EventBridge - Event Bus
     ***/

    // EventBus
    const eventBus = new EventBus(this, 'PecuniaryEventBus', {
      eventBusName: `${props.appName}-bus-${props.envName}`,
    });

    /***
     *** AWS AppSync resolvers - AWS Lambda
     ***/

    // Resolver for Accounts
    const accountsResolverFunction = new Function(this, 'AccountsResolver', {
      functionName: `${props.appName}-${props.envName}-AccountsResolver`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'accountsResolver')),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        DATA_TABLE_NAME: dataTable.tableName,
        REGION: REGION,
      },
      //deadLetterQueue: commandHandlerQueue,
    });
    // Add permissions to DynamoDB table
    accountsResolverFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
        resources: [dataTable.tableArn],
      })
    );
    accountsResolverFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Query'],
        resources: [
          dataTable.tableArn,
          dataTable.tableArn + '/index/aggregateId-lsi',
          dataTable.tableArn + '/index/entity-lsi',
          dataTable.tableArn + '/index/transactionDate-lsi',
        ],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const accountsResolverDataSource = api.addLambdaDataSource('accountsDataSource', accountsResolverFunction);
    // Resolvers
    accountsResolverDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getAccounts',
    });
    accountsResolverDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createAccount',
    });
    accountsResolverDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateAccount',
    });
    accountsResolverDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteAccount',
    });

    // Resolver for Transactions
    const transactionsReolverFunction = new Function(this, 'TransactionsResolver', {
      functionName: `${props.appName}-${props.envName}-TransactionsResolver`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'transactionsResolver')),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        DATA_TABLE_NAME: dataTable.tableName,
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
        REGION: REGION,
      },
      //deadLetterQueue: commandHandlerQueue,
    });
    // Add permissions to DynamoDB table
    transactionsReolverFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
        resources: [dataTable.tableArn],
      })
    );
    transactionsReolverFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Query'],
        resources: [dataTable.tableArn, dataTable.tableArn + '/index/aggregateId-lsi', dataTable.tableArn + '/index/entity-lsi'],
      })
    );
    // Add permission to send to EventBridge
    transactionsReolverFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const transactionsResolverDataSource = api.addLambdaDataSource('transactionsDataSource', transactionsReolverFunction);
    // Resolvers
    transactionsResolverDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getTransactions',
    });
    transactionsResolverDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createTransaction',
    });
    transactionsResolverDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateTransaction',
    });
    transactionsResolverDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteTransaction',
    });

    // Resolver for Positions
    const positionsResolverFunction = new Function(this, 'PositionsResolver', {
      functionName: `${props.appName}-${props.envName}-PositionsResolver`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'positionsResolver')),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        DATA_TABLE_NAME: dataTable.tableName,
        REGION: REGION,
      },
      //deadLetterQueue: commandHandlerQueue,
    });
    // Add permissions to DynamoDB table
    positionsResolverFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Query'],
        resources: [dataTable.tableArn, dataTable.tableArn + '/index/entity-lsi'],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const positionsResolverDataSource = api.addLambdaDataSource('positionsDataSource', positionsResolverFunction);
    // Resolvers
    positionsResolverDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getPositions',
    });
    positionsResolverDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getAllPositions',
    });

    /***
     *** AWS Lambda - Event Handlers
     ***/

    const updatePositionsFunction = new Function(this, 'UpdatePositions', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-${props.envName}-UpdatePositions`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'updatePositions')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        DATA_TABLE_NAME: dataTable.tableName,
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to call DynamoDB
    updatePositionsFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Query'],
        resources: [
          dataTable.tableArn,
          dataTable.tableArn + '/index/aggregateId-lsi',
          dataTable.tableArn + '/index/entity-lsi',
          dataTable.tableArn + '/index/transactionDate-lsi',
        ],
      })
    );
    updatePositionsFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem'],
        resources: [dataTable.tableArn],
      })
    );
    // Add permission to send to EventBridge
    updatePositionsFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );

    /***
     *** AWS EventBridge - Event Bus Rules
     ***/

    // EventBus Rule - TransactionSavedEventRule
    const transactionSavedEventRule = new Rule(this, 'TransactionSavedEventRule', {
      ruleName: `${props.appName}-TransactionSavedEvent-${props.envName}`,
      description: 'TransactionSavedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['TransactionSavedEvent'],
      },
    });
    transactionSavedEventRule.addTarget(
      new LambdaFunction(updatePositionsFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    /***
     *** Deploy web hosting to prod account only
     ***/

    // CloudFront OAI
    const cloudfrontOAI = new OriginAccessIdentity(this, 'cloudfront-OAI', {
      comment: `OAI for ${id}`,
    });

    // S3 bucket for client app
    const hostingBucket = new Bucket(this, 'PecuniaryHostingBucket', {
      bucketName: `${props.appName}-hosting-bucket-${props.envName}`,
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedHeaders: ['Authorization', 'Content-Length'],
          allowedMethods: [HttpMethods.GET],
          allowedOrigins: ['*'],
          maxAge: 3000,
        },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    // Grant access to CloudFront
    hostingBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [hostingBucket.arnForObjects('*')],
        principals: [new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      })
    );

    // Existing ACM certificate
    const certificate = Certificate.fromCertificateArn(this, 'Certificate', process.env.CERTIFICATE_ARN || '');

    // CloudFront distribution
    const distribution = new CloudFrontWebDistribution(this, 'PecuniaryWebsiteCloudFront', {
      priceClass: PriceClass.PRICE_CLASS_100,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: hostingBucket,
            originAccessIdentity: cloudfrontOAI,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              defaultTtl: Duration.hours(1),
              minTtl: Duration.seconds(0),
              maxTtl: Duration.days(1),
              compress: true,
              allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
            },
          ],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          errorCachingMinTtl: 60,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
      viewerCertificate:
        props.envName === 'prod'
          ? ViewerCertificate.fromAcmCertificate(certificate, {
              aliases: [`${props.appName}.ericbach.dev`],
              securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
              sslMethod: SSLMethod.SNI,
            })
          : undefined,
    });

    // S3 bucket deployment
    const bucketDeployment = new BucketDeployment(this, 'PecuniaryWebsiteDeployment', {
      sources: [Source.asset('../client/build')],
      destinationBucket: hostingBucket,
      retainOnDelete: false,
      contentLanguage: 'en',
      //storageClass: StorageClass.INTELLIGENT_TIERING,
      serverSideEncryption: ServerSideEncryption.AES_256,
      cacheControl: [CacheControl.setPublic(), CacheControl.maxAge(Duration.minutes(1))],
      distribution,
      distributionPaths: ['/static/css/*'],
    });

    if (props.env === 'prod') {
      // Route53 HostedZone A record
      var existingHostedZone = HostedZone.fromLookup(this, 'Zone', {
        domainName: 'ericbach.dev',
      });
      const aliasRecord = new ARecord(this, 'AliasRecord', {
        zone: existingHostedZone,
        recordName: `${props.appName}.ericbach.dev`,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      });
    }

    /***
     *** Outputs
     ***/

    // Cognito User Pool
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });

    // Dead Letter Queues
    new CfnOutput(this, 'EventHandlerQueueArn', { value: eventHandlerQueue.queueArn });

    // SNS Topics
    new CfnOutput(this, 'EventHandlerTopicArn', { value: eventHandlerTopic.topicArn });

    // AppSync API
    new CfnOutput(this, 'GraphQLApiUrl', { value: api.graphqlUrl });
    new CfnOutput(this, 'AppSyncAPIKey', { value: api.apiKey || '' });

    // DynamoDB tables
    new CfnOutput(this, 'DataTableArn', { value: dataTable.tableArn });

    // EventBridge
    new CfnOutput(this, 'EventBusArn', { value: eventBus.eventBusArn });
    new CfnOutput(this, 'TransactionSavedEventRuleArn', { value: transactionSavedEventRule.ruleArn });

    // Lambda functions
    new CfnOutput(this, 'CognitoPostConfirmationFunctionArn', { value: cognitoPostConfirmationTrigger.functionArn });
    new CfnOutput(this, 'AccountResolverFunctionArn', { value: accountsResolverFunction.functionArn });
    new CfnOutput(this, 'TransactionsResolverFunctionArn', { value: transactionsReolverFunction.functionArn });
    new CfnOutput(this, 'PositionsResolverFunctionArn', { value: positionsResolverFunction.functionArn });
    new CfnOutput(this, 'UpdatePositionsFunctionArn', { value: updatePositionsFunction.functionArn });
  }
}

import { Stack, CfnOutput, Expiration, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Function, Runtime, Code, StartingPosition } from 'aws-cdk-lib/aws-lambda';
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
import { Table, BillingMode, AttributeType, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
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
      functionName: `${props.appName}-cognitoPostConfirmationTrigger-${props.envName}`,
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

    // Event Bus DLQ
    const eventBusQueue = new Queue(this, 'EventBusQueue', {
      queueName: `${props.appName}-eventBus-DeadLetterQueue-${props.envName}`,
    });

    // Event handler DLQ
    const eventHandlerQueue = new Queue(this, 'EventHandlerQueue', {
      queueName: `${props.appName}-eventHandler-DeadLetterQueue-${props.envName}`,
    });

    /***
     *** AWS SNS - Topics
     ***/

    const eventBusTopic = new Topic(this, 'EventBusTopic', {
      topicName: `${props.appName}-eventBus-Topic-${props.envName}`,
      displayName: 'event Bus Topic',
    });
    if (props.params.dlqNotifications) {
      eventBusTopic.addSubscription(new EmailSubscription(props.params.dlqNotifications));
    }

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

    const eventBusAlarm = new Alarm(this, 'EventBusAlarm', {
      alarmName: `${props.appName}-eventBus-Alarm-${props.envName}`,
      alarmDescription: 'One or more failed EventBus messages',
      metric: metric,
      datapointsToAlarm: 1,
      evaluationPeriods: 2,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    eventBusAlarm.addAlarmAction(new SnsAction(eventBusTopic));

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
      name: `${props.appName}-api-${props.envName}`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      schema: Schema.fromAsset(path.join(__dirname, './graphql/schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
            },
          },
        ],
      },
    });

    /***
     *** AWS DynamoDB
     ***/

    // DynamoDB table for AccountType
    const accountTypeTable = new Table(this, 'AccountType', {
      tableName: `${props.appName}-AccountType-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for CurrencyType
    const currencyTypeTable = new Table(this, 'CurrencyType', {
      tableName: `${props.appName}-CurrencyType-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for ExchangeType
    const exchangeTypeTable = new Table(this, 'ExchangeType', {
      tableName: `${props.appName}-ExchangeType-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for TransactionType
    const transactionTypeTable = new Table(this, 'TransactionType', {
      tableName: `${props.appName}-TransactionType-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for AccountReadModel
    const accountReadModelTable = new Table(this, 'AccountReadModel', {
      tableName: `${props.appName}-AccountReadModel-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for PositionReadModel
    const positionReadModelTable = new Table(this, 'PositionReadModel', {
      tableName: `${props.appName}-PositionReadModel-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for TransactionReadModel
    const transactionReadModelTable = new Table(this, 'TransactionReadModel', {
      tableName: `${props.appName}-TransactionReadModel-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for TimeSeries
    const timeSeriesTable = new Table(this, 'TimeSeries', {
      tableName: `${props.appName}-TimeSeries-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Add a global secondary index to enable another data access pattern
    /*
    productTable.addGlobalSecondaryIndex({
      indexName: 'productsByCategory',
      partitionKey: {
        name: 'category',
        type: AttributeType.STRING,
      },
    });
    */

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
    const accountHandlerFunction = new Function(this, 'AccountHandler', {
      functionName: `${props.appName}-AccountHandler-${props.envName}`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'accountHandler')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        ACCOUNT_TYPE_TABLE_NAME: accountTypeTable.tableName,
        TRANSACTION_TYPE_TABLE_NAME: transactionTypeTable.tableName,
        ACCOUNT_TABLE_NAME: accountReadModelTable.tableName,
        TRANSACTION_TABLE_NAME: transactionReadModelTable.tableName,
        POSITION_TABLE_NAME: positionReadModelTable.tableName,
      },
      //deadLetterQueue: commandHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    accountHandlerFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem'],
        resources: [accountReadModelTable.tableArn],
      })
    );
    // Add permissions to write to DynamoDB table
    accountHandlerFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Scan', 'dynamodb:DeleteItem'],
        resources: [accountReadModelTable.tableArn, positionReadModelTable.tableArn, transactionReadModelTable.tableArn],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const accountHandlerDataSource = api.addLambdaDataSource('accountDataSource', accountHandlerFunction);
    // Resolvers
    accountHandlerDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getAccountByAggregateId',
    });
    accountHandlerDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getAccountsByUser',
    });
    accountHandlerDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createAccount',
    });
    accountHandlerDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateAccount',
    });
    accountHandlerDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteAccount',
    });

    // Resolver for Transactions
    const transactionHandlerFunction = new Function(this, 'TransactionHandler', {
      functionName: `${props.appName}-TransactionHandler-${props.envName}`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'transactionHandler')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
        TRANSACTION_TABLE_NAME: transactionReadModelTable.tableName,
        REGION: REGION,
      },
      //deadLetterQueue: commandHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    transactionHandlerFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:Scan', 'dynamodb:DeleteItem'],
        resources: [transactionReadModelTable.tableArn],
      })
    );
    // Add permission to send to EventBridge
    transactionHandlerFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const transactionHandlerDataSource = api.addLambdaDataSource('transactionDataSource', transactionHandlerFunction);
    // Resolvers
    transactionHandlerDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getTransactionsByAccountId',
    });
    transactionHandlerDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createTransaction',
    });
    transactionHandlerDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateTransaction',
    });
    transactionHandlerDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteTransaction',
    });

    // Resolver for Positions
    const positionHandlerFunction = new Function(this, 'PositionHandler', {
      functionName: `${props.appName}-PositionHandler-${props.envName}`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'positionHandler')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        POSITION_TABLE_NAME: positionReadModelTable.tableName,
      },
      //deadLetterQueue: commandHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    accountHandlerFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Scan'],
        resources: [positionReadModelTable.tableArn],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const positionHandlerDataSource = api.addLambdaDataSource('positionDataSource', positionHandlerFunction);
    // Resolvers
    positionHandlerDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getPositionsByAccountId',
    });

    // Resolver for AccountTypes
    const accountTypeHandlerFunction = new Function(this, 'AccountTypeHandler', {
      functionName: `${props.appName}-AccountTypeHandler-${props.envName}`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'accountTypeHandler')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        ACCOUNT_TYPE_TABLE_NAME: accountTypeTable.tableName,
      },
      //deadLetterQueue: commandHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    accountTypeHandlerFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Scan'],
        resources: [accountTypeTable.tableArn],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const accountTypeHandlerDataSource = api.addLambdaDataSource('accountTypeDataSource', accountTypeHandlerFunction);
    // Resolvers
    accountTypeHandlerDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listAccountTypes',
    });

    // Resolver for TransactionTypes
    const transactionTypeHandlerFunction = new Function(this, 'TransactionTypeHandler', {
      functionName: `${props.appName}-TransactionTypeHandler-${props.envName}`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'transactionTypeHandler')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        TRANSACTION_TYPE_TABLE_NAME: transactionTypeTable.tableName,
      },
      //deadLetterQueue: commandHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    transactionTypeHandlerFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Scan'],
        resources: [transactionTypeTable.tableArn],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const transactionTypeHandlerDataSource = api.addLambdaDataSource('transactionTypeDataSource', transactionTypeHandlerFunction);
    // Resolvers
    accountTypeHandlerDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listTransactionTypes',
    });

    /***
     *** AWS DynamoDB
     ***/

    // Allow DynamoDB streams from Event table to send event source mapping to EventBus lambda function
    //eventTable.grantWriteData(eventBusFunction);
    // Enable the Lambda function to access the DynamoDB table (using IAM)
    // accountTypeTable.grantFullAccess(accountHandlerFunction);
    // transactionTypeTable.grantReadData(accountHandlerFunction);

    /***
     *** AWS Lambda - Event Handlers
     ***/

    const updateAccountValuesFunction = new Function(this, 'UpdateAccountValues', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-updateAccountValues-${props.envName}`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'updateAccountValues')),
      memorySize: 768,
      timeout: Duration.seconds(10),
      environment: {
        ACCOUNT_TABLE_NAME: accountReadModelTable.tableName,
        POSITION_TABLE_NAME: positionReadModelTable.tableName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to read/write to DynamoDB table
    updateAccountValuesFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:getItem', 'dynamodb:UpdateItem'],
        resources: [accountReadModelTable.tableArn],
      })
    );
    updateAccountValuesFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:scan'],
        resources: [positionReadModelTable.tableArn],
      })
    );

    const createUpdatePositiopnFunction = new Function(this, 'CreateUpdatePosition', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-CreateUpdatePosition-${props.envName}`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'createUpdatePosition')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        TRANSACTION_TABLE_NAME: transactionReadModelTable.tableName,
        POSITION_TABLE_NAME: positionReadModelTable.tableName,
        TIME_SERIES_TABLE_NAME: timeSeriesTable.tableName,
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to call DynamoDB
    createUpdatePositiopnFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Scan'],
        resources: [transactionReadModelTable.tableArn, positionReadModelTable.tableArn],
      })
    );
    createUpdatePositiopnFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:GetItem'],
        resources: [positionReadModelTable.tableArn],
      })
    );
    createUpdatePositiopnFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [timeSeriesTable.tableArn, positionReadModelTable.tableArn],
      })
    );
    // Add permission to send to EventBridge
    createUpdatePositiopnFunction.addToRolePolicy(
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
      new LambdaFunction(createUpdatePositiopnFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - PositionUpdatedEventRule
    const positionUpdatedEventRule = new Rule(this, 'PositionUpdatedEventRule', {
      ruleName: `${props.appName}-PositionUpdatedEvent-${props.envName}`,
      description: 'PositionUpdatedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['PositionUpdatedEvent'],
      },
    });
    positionUpdatedEventRule.addTarget(
      new LambdaFunction(updateAccountValuesFunction, {
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
    new CfnOutput(this, 'EventBusQueueArn', { value: eventBusQueue.queueArn });
    new CfnOutput(this, 'EventHandlerQueueArn', { value: eventHandlerQueue.queueArn });

    // SNS Topics
    new CfnOutput(this, 'EventBusTopicArn', { value: eventBusTopic.topicArn });
    new CfnOutput(this, 'EventHandlerTopicArn', { value: eventHandlerTopic.topicArn });

    // AppSync API
    new CfnOutput(this, 'GraphQLApiUrl', { value: api.graphqlUrl });
    new CfnOutput(this, 'AppSyncAPIKey', { value: api.apiKey || '' });

    // DynamoDB tables
    new CfnOutput(this, 'accountTypeTableArn', { value: accountTypeTable.tableArn });
    new CfnOutput(this, 'currencyTypeTableArn', { value: currencyTypeTable.tableArn });
    new CfnOutput(this, 'exchangeTypeTableArn', { value: exchangeTypeTable.tableArn });
    new CfnOutput(this, 'transactionTypeTableArn', { value: transactionTypeTable.tableArn });
    new CfnOutput(this, 'accountReadModelTableArn', { value: accountReadModelTable.tableArn });
    new CfnOutput(this, 'positionReadModelTable', { value: positionReadModelTable.tableArn });
    new CfnOutput(this, 'transactionReadModelTable', { value: transactionReadModelTable.tableArn });
    new CfnOutput(this, 'timeSeriesTable', { value: timeSeriesTable.tableArn });

    // EventBridge
    new CfnOutput(this, 'EventBusArn', { value: eventBus.eventBusArn });
    new CfnOutput(this, 'TransactionSavedEventRuleArn', { value: transactionSavedEventRule.ruleArn });
    new CfnOutput(this, 'PositionUpdatedEventRuleArn', { value: positionUpdatedEventRule.ruleArn });

    // Lambda functions
    new CfnOutput(this, 'CognitoHandlerFunctionArn', { value: cognitoPostConfirmationTrigger.functionArn });
    new CfnOutput(this, 'AccountHandlerFunctionArn', { value: accountHandlerFunction.functionArn });
    new CfnOutput(this, 'TransactionHandlerFunctionArn', { value: transactionHandlerFunction.functionArn });
    new CfnOutput(this, 'PositionHandlerFunctionArn', { value: positionHandlerFunction.functionArn });
    new CfnOutput(this, 'AccountTypeHandlerFunctionArn', { value: accountTypeHandlerFunction.functionArn });
    new CfnOutput(this, 'TransactionTypeHandlerFunctionArn', { value: transactionTypeHandlerFunction.functionArn });
    new CfnOutput(this, 'CreateUpdatePositionFunctionArn', { value: createUpdatePositiopnFunction.functionArn });
    new CfnOutput(this, 'AccountValuesUpdatedEventFunctionArn', { value: updateAccountValuesFunction.functionArn });
  }
}

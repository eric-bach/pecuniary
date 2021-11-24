import { Stack, Construct, CfnOutput, Expiration, Duration, RemovalPolicy } from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';
import { PolicyStatement, Policy, Effect } from '@aws-cdk/aws-iam';
import {
  UserPool,
  CfnUserPoolGroup,
  UserPoolClient,
  AccountRecovery,
  VerificationEmailStyle,
  UserPoolDomain,
} from '@aws-cdk/aws-cognito';
import { Topic } from '@aws-cdk/aws-sns';
import { EmailSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { Queue } from '@aws-cdk/aws-sqs';
import { Alarm, Metric, ComparisonOperator } from '@aws-cdk/aws-cloudwatch';
import { GraphqlApi, Schema, FieldLogLevel, AuthorizationType } from '@aws-cdk/aws-appsync';
import { Table, BillingMode, AttributeType, StreamViewType } from '@aws-cdk/aws-dynamodb';
import { Function, Runtime, Code, StartingPosition } from '@aws-cdk/aws-lambda';
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Rule, EventBus } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions';

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
     *** AWS SSM
     ***/

    const alphaVantageApiKey = new ssm.StringParameter(this, 'AlphaVantageAPIKey', {
      description: 'AlphaVantage API Key',
      parameterName: `${props.appName}-AlphaVantageAPIKey`,
      stringValue: process.env.ALPHA_VANTAGE_API_KEY || '',
      tier: ssm.ParameterTier.STANDARD,
    });

    /***
     *** AWS Lambda - Cognito post-confirmation trigger
     ***/

    // AWS Cognito post-confirmation lambda function
    const cognitoPostConfirmationTrigger = new Function(this, 'CognitoPostConfirmationTrigger', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-cognitoPostConfirmationTrigger`,
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
      userPoolName: `${props.appName}_user_pool`,
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

    // Command handler DLQ
    const commandHandlerQueue = new Queue(this, 'CommandHandlerQueue', {
      queueName: `${props.appName}-commandHandler-DeadLetterQueue`,
    });

    // Event Bus DLQ
    const eventBusQueue = new Queue(this, 'EventBusQueue', {
      queueName: `${props.appName}-eventBus-DeadLetterQueue`,
    });

    // Event handler DLQ
    const eventHandlerQueue = new Queue(this, 'EventHandlerQueue', {
      queueName: `${props.appName}-eventHandler-DeadLetterQueue`,
    });

    /***
     *** AWS SNS - Topics
     ***/

    const commandHandlerTopic = new Topic(this, 'CommandHandlerTopic', {
      topicName: `${props.appName}-commandHandler-Topic`,
      displayName: 'Command Handler Topic',
    });
    if (props.dlqNotifications) {
      commandHandlerTopic.addSubscription(new EmailSubscription(props.dlqNotifications));
    }

    const eventBusTopic = new Topic(this, 'EventBusTopic', {
      topicName: `${props.appName}-eventBus-Topic`,
      displayName: 'event Bus Topic',
    });
    if (props.dlqNotifications) {
      eventBusTopic.addSubscription(new EmailSubscription(props.dlqNotifications));
    }

    const eventHandlerTopic = new Topic(this, 'EventHandlerTopic', {
      topicName: `${props.appName}-eventHandler-Topic`,
      displayName: 'Event Handler Topic',
    });
    if (props.dlqNotifications) {
      eventHandlerTopic.addSubscription(new EmailSubscription(props.dlqNotifications));
    }

    /***
     *** AWS CloudWatch - Alarms
     ***/

    const commandHandlerAlarm = new Alarm(this, 'CommandHandlerAlarm', {
      alarmName: `${props.appName}-commandHandler-Alarm`,
      alarmDescription: 'One or more failed CommandHandler messages',
      metric: new Metric({
        namespace: 'AWS/SQS',
        metricName: 'NumberOfMessagesSent',
      }),
      statistic: 'Sum',
      period: Duration.seconds(300),
      datapointsToAlarm: 1,
      evaluationPeriods: 2,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    commandHandlerAlarm.addAlarmAction(new SnsAction(commandHandlerTopic));

    const eventBusAlarm = new Alarm(this, 'EventBusAlarm', {
      alarmName: `${props.appName}-eventBus-Alarm`,
      alarmDescription: 'One or more failed EventBus messages',
      metric: new Metric({
        namespace: 'AWS/SQS',
        metricName: 'NumberOfMessagesSent',
      }),
      statistic: 'Sum',
      period: Duration.seconds(300),
      datapointsToAlarm: 1,
      evaluationPeriods: 2,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    eventBusAlarm.addAlarmAction(new SnsAction(eventBusTopic));

    const eventHandlerAlarm = new Alarm(this, 'EventHandlerAlarm', {
      alarmName: `${props.appName}-eventHandler-Alarm`,
      alarmDescription: 'One or more failed EventHandler messages',
      metric: new Metric({
        namespace: 'AWS/SQS',
        metricName: 'NumberOfMessagesSent',
      }),
      statistic: 'Sum',
      period: Duration.seconds(300),
      datapointsToAlarm: 1,
      evaluationPeriods: 2,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    eventHandlerAlarm.addAlarmAction(new SnsAction(eventHandlerTopic));

    /***
     *** AWS AppSync
     ***/

    // AppSync API
    const api = new GraphqlApi(this, 'PecuniaryApi', {
      name: `${props.appName}-api`,
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

    // DynamoDB table for Events
    const eventTable = new Table(this, 'Event', {
      tableName: `${props.appName}-Event`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_IMAGE,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for AccountType
    const accountTypeTable = new Table(this, 'AccountType', {
      tableName: `${props.appName}-AccountType`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for CurrencyType
    const currencyTypeTable = new Table(this, 'CurrencyType', {
      tableName: `${props.appName}-CurrencyType`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for ExchangeType
    const exchangeTypeTable = new Table(this, 'ExchangeType', {
      tableName: `${props.appName}-ExchangeType`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for TransactionType
    const transactionTypeTable = new Table(this, 'TransactionType', {
      tableName: `${props.appName}-TransactionType`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for AccountReadModel
    const accountReadModelTable = new Table(this, 'AccountReadModel', {
      tableName: `${props.appName}-AccountReadModel`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for PositionReadModel
    const positionReadModelTable = new Table(this, 'PositionReadModel', {
      tableName: `${props.appName}-PositionReadModel`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for TransactionReadModel
    const transactionReadModelTable = new Table(this, 'TransactionReadModel', {
      tableName: `${props.appName}-TransactionReadModel`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB table for TimeSeries
    const timeSeriesTable = new Table(this, 'TimeSeries', {
      tableName: `${props.appName}-TimeSeries`,
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
     *** AWS AppSync resolver - AWS Lambda
     ***/

    // Command handler Lambda function for AppSync events
    const commandHandlerFunction = new Function(this, 'CommandHandler', {
      functionName: `${props.appName}-CommandHandler`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'commandHandler')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        EVENT_TABLE_NAME: eventTable.tableName,
        ACCOUNT_TYPE_TABLE_NAME: accountTypeTable.tableName,
        TRANSACTION_TYPE_TABLE_NAME: transactionTypeTable.tableName,
        ACCOUNT_TABLE_NAME: accountReadModelTable.tableName,
        TRANSACTION_TABLE_NAME: transactionReadModelTable.tableName,
        POSITION_TABLE_NAME: positionReadModelTable.tableName,
      },
      deadLetterQueue: commandHandlerQueue,
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDataSource = api.addLambdaDataSource('lambdaDataSource', commandHandlerFunction);

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createEvent',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getAccountByAggregateId',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getAccountsByUser',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getPositionsByAccountId',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getTransactionsByAccountId',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listAccountTypes',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listTransactionTypes',
    });

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listEvents',
    });

    /***
     *** AWS EventBridge - Event Bus
     ***/

    // EventBus
    const eventBus = new EventBus(this, 'PecuniaryEventBus', {
      eventBusName: `${props.appName}-bus`,
    });

    /***
     *** AWS Lambda - Event Bus
     ***/

    // Event bus handler for DynamoDB streams events
    const eventBusFunction = new Function(this, 'EventBus', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-EventBus`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'eventBus')),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
      },
      deadLetterQueue: eventBusQueue,
    });
    // Add DynamoDB streams as an Event Source to the Lambda function
    eventBusFunction.addEventSource(
      new DynamoEventSource(eventTable, {
        startingPosition: StartingPosition.TRIM_HORIZON,
        batchSize: 5,
        bisectBatchOnError: true,
        //onFailure: new SqsDlq(deadLetterQueue),
        retryAttempts: 3,
      })
    );
    // Add permissions to put event on EventBus
    eventBusFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );

    /***
     *** AWS DynamoDB
     ***/

    // Allow DynamoDB streams from Event table to send event source mapping to EventBus lambda function
    eventTable.grantWriteData(eventBusFunction);
    // Enable the Lambda function to access the DynamoDB table (using IAM)
    eventTable.grantFullAccess(commandHandlerFunction);
    accountTypeTable.grantReadData(commandHandlerFunction);
    transactionTypeTable.grantReadData(commandHandlerFunction);
    accountReadModelTable.grantFullAccess(commandHandlerFunction);
    transactionReadModelTable.grantFullAccess(commandHandlerFunction);
    positionReadModelTable.grantFullAccess(commandHandlerFunction);
    transactionReadModelTable.grantFullAccess(commandHandlerFunction);
    positionReadModelTable.grantFullAccess(commandHandlerFunction);
    timeSeriesTable.grantFullAccess(commandHandlerFunction);

    /***
     *** AWS Lambda - Event Handlers
     ***/
    const createAccountFunction = new Function(this, 'CreateAccount', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-createAccount`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'createAccount')),
      memorySize: 768,
      timeout: Duration.seconds(10),
      environment: {
        ACCOUNT_TABLE_NAME: accountReadModelTable.tableName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    createAccountFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [accountReadModelTable.tableArn],
      })
    );

    const updateAccountFunction = new Function(this, 'UpdateAccount', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-updateAccount`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'updateAccount')),
      memorySize: 768,
      timeout: Duration.seconds(10),
      environment: {
        ACCOUNT_TABLE_NAME: accountReadModelTable.tableName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    updateAccountFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:UpdateItem'],
        resources: [accountReadModelTable.tableArn],
      })
    );

    const deleteAccountFunction = new Function(this, 'DeleteAccount', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-deleteAccount`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'deleteAccount')),
      memorySize: 768,
      timeout: Duration.seconds(10),
      environment: {
        ACCOUNT_TABLE_NAME: accountReadModelTable.tableName,
        POSITION_TABLE_NAME: positionReadModelTable.tableName,
        TRANSACTION_TABLE_NAME: transactionReadModelTable.tableName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    deleteAccountFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Scan', 'dynamodb:DeleteItem'],
        resources: [
          accountReadModelTable.tableArn,
          positionReadModelTable.tableArn,
          transactionReadModelTable.tableArn,
        ],
      })
    );

    const updateAccountValuesFunction = new Function(this, 'UpdateAccountValues', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-updateAccountValues`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'updateAccountValues')),
      memorySize: 768,
      timeout: Duration.seconds(10),
      environment: {
        ACCOUNT_TABLE_NAME: accountReadModelTable.tableName,
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

    const createTransactionFunction = new Function(this, 'CreateTransaction', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-createTransaction`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'createTransaction')),
      memorySize: 768,
      timeout: Duration.seconds(10),
      environment: {
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
        TRANSACTION_TABLE_NAME: transactionReadModelTable.tableName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    createTransactionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [transactionReadModelTable.tableArn],
      })
    );
    // Add permission to send to EventBridge
    createTransactionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );

    const updateTransactionFunction = new Function(this, 'UpdateTransaction', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-updateTransaction`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'updateTransaction')),
      memorySize: 768,
      timeout: Duration.seconds(10),
      environment: {
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
        TRANSACTION_TABLE_NAME: transactionReadModelTable.tableName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    updateTransactionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:UpdateItem'],
        resources: [transactionReadModelTable.tableArn],
      })
    );
    // Add permission to send to EventBridge
    updateTransactionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );

    const deleteTransactionFunction = new Function(this, 'DeleteTransaction', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-deleteTransaction`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'deleteTransaction')),
      memorySize: 768,
      timeout: Duration.seconds(10),
      environment: {
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
        TRANSACTION_TABLE_NAME: transactionReadModelTable.tableName,
        REGION: REGION,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to write to DynamoDB table
    deleteTransactionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Scan', 'dynamodb:DeleteItem'],
        resources: [transactionReadModelTable.tableArn],
      })
    );
    // Add permission to send to EventBridge
    deleteTransactionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );

    const createUpdatePositionFunction = new Function(this, 'CreateUpdatePosition', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-createUpdatePosition`,
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
    createUpdatePositionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Scan'],
        resources: [transactionReadModelTable.tableArn, positionReadModelTable.tableArn],
      })
    );
    createUpdatePositionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:GetItem'],
        resources: [positionReadModelTable.tableArn],
      })
    );
    createUpdatePositionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [timeSeriesTable.tableArn, positionReadModelTable.tableArn],
      })
    );
    // Add permissions to call SSM
    createUpdatePositionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['ssm:GetParameter'],
        resources: [alphaVantageApiKey.parameterArn],
      })
    );
    // Add permission to send to EventBridge
    createUpdatePositionFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );

    /***
     *** AWS EventBridge - Event Bus Rules
     ***/
    // EventBus Rule - AccountCreatedEventRule
    const accountCreatedEventRule = new Rule(this, 'AccountCreatedEventRule', {
      ruleName: `${props.appName}-AccountCreatedEvent`,
      description: 'AccountCreatedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['AccountCreatedEvent'],
      },
    });
    accountCreatedEventRule.addTarget(
      new LambdaFunction(createAccountFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - AccountUpdatedEventRule
    const accountUpdatedEventRule = new Rule(this, 'AccountUpdatedEventRule', {
      ruleName: `${props.appName}-AccountUpdatedEvent`,
      description: 'AccountUpdatedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['AccountUpdatedEvent'],
      },
    });
    accountUpdatedEventRule.addTarget(
      new LambdaFunction(updateAccountFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - AccountDeletedEventRule
    const accountDeletedEventRule = new Rule(this, 'AccountDeletedEventRule', {
      ruleName: `${props.appName}-AccountDeletedEvent`,
      description: 'AccountDeletedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['AccountDeletedEvent'],
      },
    });
    accountDeletedEventRule.addTarget(
      new LambdaFunction(deleteAccountFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - TransactionCreatedEventRule
    const transactionCreatedEventRule = new Rule(this, 'TransactionCreatedEventRule', {
      ruleName: `${props.appName}-TransactionCreatedEvent`,
      description: 'TransactionCreatedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['TransactionCreatedEvent'],
      },
    });
    transactionCreatedEventRule.addTarget(
      new LambdaFunction(createTransactionFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - TransactionUpdatedEventRule
    const transactionUpdatedEventRule = new Rule(this, 'TransactionUpdatedEventRule', {
      ruleName: `${props.appName}-TransactionUpdatedEvent`,
      description: 'TransactionUpdatedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['TransactionUpdatedEvent'],
      },
    });

    transactionUpdatedEventRule.addTarget(
      new LambdaFunction(updateTransactionFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - TransactionDeletedEventRule
    const transactionDeletedEventRule = new Rule(this, 'TransactionDeletedEventRule', {
      ruleName: `${props.appName}-TransactionDeletedEvent`,
      description: 'TransactionDeletedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['TransactionDeletedEvent'],
      },
    });

    transactionDeletedEventRule.addTarget(
      new LambdaFunction(deleteTransactionFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - TransactionSavedEventRule
    const transactionSavedEventRule = new Rule(this, 'TransactionSavedEventRule', {
      ruleName: `${props.appName}-TransactionSavedEvent`,
      description: 'TransactionSavedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['TransactionSavedEvent'],
      },
    });
    transactionSavedEventRule.addTarget(
      new LambdaFunction(createUpdatePositionFunction, {
        //deadLetterQueue: SqsQueue,
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - PositionUpdatedEventRule
    const positionUpdatedEventRule = new Rule(this, 'PositionUpdatedEventRule', {
      ruleName: `${props.appName}-PositionUpdatedEvent`,
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
     *** Outputs
     ***/

    // SSM Parameter Keys
    new CfnOutput(this, 'AlphaVantageAPIKeyArn', { value: alphaVantageApiKey.parameterArn });

    // Cognito User Pool
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });

    // Dead Letter Queues
    new CfnOutput(this, 'CommandHandlerQueueArn', { value: commandHandlerQueue.queueArn });
    new CfnOutput(this, 'EventBusQueueArn', { value: eventBusQueue.queueArn });
    new CfnOutput(this, 'EventHandlerQueueArn', { value: eventHandlerQueue.queueArn });

    // SNS Topics
    new CfnOutput(this, 'CommandHandlerTopicArn', { value: commandHandlerTopic.topicArn });
    new CfnOutput(this, 'EventBusTopicArn', { value: eventBusTopic.topicArn });
    new CfnOutput(this, 'EventHandlerTopicArn', { value: eventHandlerTopic.topicArn });

    // AppSync API
    new CfnOutput(this, 'GraphQLApiUrl', { value: api.graphqlUrl });
    new CfnOutput(this, 'AppSyncAPIKey', { value: api.apiKey || '' });

    // DynamoDB tables
    new CfnOutput(this, 'eventTableArn', { value: eventTable.tableArn });
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
    new CfnOutput(this, 'AccountCreatedEventRuleArn', { value: accountCreatedEventRule.ruleArn });
    new CfnOutput(this, 'AccountUpdatedEventRuleArn', { value: accountUpdatedEventRule.ruleArn });
    new CfnOutput(this, 'AccountDeletedEventRuleArn', { value: accountDeletedEventRule.ruleArn });
    new CfnOutput(this, 'TransactionCreatedEventRuleArn', { value: transactionCreatedEventRule.ruleArn });
    new CfnOutput(this, 'TransactionUpdatedEventRuleArn', { value: transactionUpdatedEventRule.ruleArn });
    new CfnOutput(this, 'TransactionDeletedEventRuleArn', { value: transactionDeletedEventRule.ruleArn });
    new CfnOutput(this, 'TransactionSavedEventRuleArn', { value: transactionSavedEventRule.ruleArn });
    new CfnOutput(this, 'PositionUpdatedEventRuleArn', { value: positionUpdatedEventRule.ruleArn });

    // Lambda functions
    new CfnOutput(this, 'CognitoHandlerFunctionArn', { value: cognitoPostConfirmationTrigger.functionArn });
    new CfnOutput(this, 'CommandHandlerFunctionArn', { value: commandHandlerFunction.functionArn });
    new CfnOutput(this, 'EventBusFunctionArn', { value: eventBusFunction.functionArn });
    new CfnOutput(this, 'AccountCreatedEventFunctionArn', { value: createAccountFunction.functionArn });
    new CfnOutput(this, 'AccountUpdatedEventFunctionArn', { value: updateAccountFunction.functionArn });
    new CfnOutput(this, 'AccountValuesUpdatedEventFunctionArn', { value: updateAccountValuesFunction.functionArn });
    new CfnOutput(this, 'AccountDeletedEventFunctionArn', { value: deleteAccountFunction.functionArn });
    new CfnOutput(this, 'TransactionCreatedEventFunctionArn', { value: createTransactionFunction.functionArn });
    new CfnOutput(this, 'TransactionUpdatedEventFunctionArn', { value: updateTransactionFunction.functionArn });
    new CfnOutput(this, 'TransactionDeletedEventFunctionArn', { value: deleteTransactionFunction.functionArn });
    new CfnOutput(this, 'CreateUpdatePositionFunctionArn', { value: createUpdatePositionFunction.functionArn });
  }
}

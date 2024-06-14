import * as path from 'path';
import { Stack, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Effect, Role, ServicePrincipal, PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Alarm, Metric, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import {
  Code,
  GraphqlApi,
  FieldLogLevel,
  InlineCode,
  AuthorizationType,
  SchemaFile,
  DynamoDbDataSource,
  FunctionRuntime,
  AppsyncFunction,
  Resolver,
} from 'aws-cdk-lib/aws-appsync';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PecuniaryApiStackProps } from './types/PecuniaryStackProps';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

const dotenv = require('dotenv');
dotenv.config();

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: PecuniaryApiStackProps) {
    super(scope, id, props);

    const userPool = UserPool.fromUserPoolId(this, 'userPool', props.params.userPoolId);
    const dataTable = Table.fromTableArn(this, 'table', props.params.dataTableArn);

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
     *** AWS EventBridge - Event Bus
     ***/

    // EventBus
    const eventBus = new EventBus(this, 'PecuniaryEventBus', {
      eventBusName: `${props.appName}-bus-${props.envName}`,
    });

    /***
     *** AWS AppSync
     ***/

    const api = new GraphqlApi(this, 'PecuniaryApi', {
      name: `${props.appName}-${props.envName}-api`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      schema: SchemaFile.fromAsset(path.join(__dirname, '../graphql/schema.graphql')),
      environmentVariables: {
        TABLE_NAME: dataTable.tableName,
        EVENTBUS_NAME: eventBus.eventBusName,
      },
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
     *** AWS AppSync - JS Resolvers
     ***/

    // AppSync DynamoDB DataSource
    const dynamoDbDataSource = new DynamoDbDataSource(this, 'DynamoDBDataSource', {
      api: api,
      table: dataTable,
      description: 'DynamoDbDataSource',
      name: 'dynamoDBDataSource',
      serviceRole: new Role(this, `${props.appName}AppSyncServiceRole`, {
        assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
        roleName: `${props.appName}-appsync-service-role-${props.envName}`,
        inlinePolicies: {
          name: new PolicyDocument({
            statements: [
              new PolicyStatement({
                effect: Effect.ALLOW,
                actions: [
                  'dynamodb:BatchGetItem',
                  'dynamodb:BatchWriteItem',
                  'dynamodb:ConditionCheckItem',
                  'dynamodb:DeleteItem',
                  'dynamodb:DescribeTable',
                  'dynamodb:GetItem',
                  'dynamodb:GetRecords',
                  'dynamodb:GetShardIterator',
                  'dynamodb:PutItem',
                  'dynamodb:Query',
                  'dynamodb:Scan',
                  'dynamodb:UpdateItem',
                ],
                resources: [dataTable.tableArn + '/*'],
              }),
            ],
          }),
        },
      }),
    });

    // AppSync JS Resolvers
    const createAccountFunction = new AppsyncFunction(this, 'createAccountFunction', {
      name: 'createAccount',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../graphql/build/Mutation.createAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const updateAccountFunction = new AppsyncFunction(this, 'updateAccountFunction', {
      name: 'updateAccount',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../graphql/build/Mutation.updateAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getAccountFunction = new AppsyncFunction(this, 'getAccountFunction', {
      name: 'getAccount',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../graphql/build/Query.getAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getAccountsFunction = new AppsyncFunction(this, 'getAccountsFunction', {
      name: 'getAccounts',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../graphql/build/Query.getAccounts.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getAggregateFunction = new AppsyncFunction(this, 'getAggregateFunction', {
      name: 'getAggregate',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../graphql/build/Query.getAggregate.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const deleteAggregateFunction = new AppsyncFunction(this, 'deleteAggregateFunction', {
      name: 'deleteAggregate',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../graphql/build/Mutation.deleteAggregate.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getTransactionsFunction = new AppsyncFunction(this, 'getTransactionsFunction', {
      name: 'getTransactions',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../graphql/build/Query.getTransactions.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });

    const passthrough = InlineCode.fromInline(`
        // The before step
        export function request(...args) {
          console.log("📢 Pipeline Request: ", args);
          return {}
        }

        // The after step
        export function response(ctx) {
          console.log("✅ Pipeline Response: ", ctx.prev.result);
          return ctx.prev.result
        }
    `);

    const createAccountResolver = new Resolver(this, 'createAccountResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'createAccount',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createAccountFunction],
      code: passthrough,
    });
    const updateAccountResolver = new Resolver(this, 'updateAccountResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'updateAccount',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [updateAccountFunction],
      code: passthrough,
    });
    const getAccountResolver = new Resolver(this, 'getAccountResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getAccount',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getAccountFunction],
      code: passthrough,
    });
    const getAccountsResolver = new Resolver(this, 'getAccountsResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getAccounts',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getAccountsFunction],
      code: passthrough,
    });
    const getAggregateResolver = new Resolver(this, 'getAggregateResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getAggregate',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getAggregateFunction],
      code: passthrough,
    });
    const deleteAggregateResolver = new Resolver(this, 'deleteAggregatesResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'deleteAggregate',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getAggregateFunction, deleteAggregateFunction],
      code: passthrough,
    });
    const getTransactionResolver = new Resolver(this, 'getTransactionsResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getTransactions',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getTransactionsFunction],
      code: passthrough,
    });

    /***
     *** AWS AppSync - Lambda Resolvers
     ***/

    // AppSync Lambda DataSource
    const transactionsReolverFunction = new NodejsFunction(this, 'TransactionsResolver', {
      functionName: `${props.appName}-${props.envName}-TransactionsResolver`,
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.resolve(__dirname, '../../backend/lambda/transactionsResolver/main.ts'),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        DATA_TABLE_NAME: dataTable.tableName,
        EVENTBUS_NAME: eventBus.eventBusName,
      },
    });
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
        resources: [dataTable.tableArn, dataTable.tableArn + '/index/aggregateId-lsi', dataTable.tableArn + '/index/aggregateId-gsi'],
      })
    );
    transactionsReolverFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );
    const transactionsResolverDataSource = api.addLambdaDataSource('transactionsDataSource', transactionsReolverFunction, {
      name: 'TransactionsLambdaDataSource',
    });

    // Lambda Resolvers
    transactionsResolverDataSource.createResolver('createTransactionResolver', {
      typeName: 'Mutation',
      fieldName: 'createTransaction',
    });
    transactionsResolverDataSource.createResolver('updateTransactionResolver', {
      typeName: 'Mutation',
      fieldName: 'updateTransaction',
    });
    transactionsResolverDataSource.createResolver('deleteTransactionResolver', {
      typeName: 'Mutation',
      fieldName: 'deleteTransaction',
    });

    /***
     *** AWS Lambda - Event Handlers
     ***/

    const updatePositionsFunction = new NodejsFunction(this, 'UpdatePositions', {
      runtime: Runtime.NODEJS_18_X,
      functionName: `${props.appName}-${props.envName}-UpdatePositions`,
      handler: 'handler',
      entry: path.resolve(__dirname, '../../backend/lambda/updatePositions/main.ts'),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      environment: {
        DATA_TABLE_NAME: dataTable.tableName,
        EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
      },
      deadLetterQueue: eventHandlerQueue,
    });
    // Add permissions to call DynamoDB
    updatePositionsFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Query'],
        resources: [dataTable.tableArn, dataTable.tableArn + '/index/aggregateId-lsi', dataTable.tableArn + '/index/aggregateId-gsi'],
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
    // Add permission send message to SQS
    updatePositionsFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['SQS:SendMessage', 'SNS:Publish'],
        resources: [eventHandlerQueue.queueArn],
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
     *** Outputs
     ***/

    // Dead Letter Queues
    new CfnOutput(this, 'EventHandlerQueueArn', {
      value: eventHandlerQueue.queueArn,
      exportName: `${props.appName}-${props.envName}-eventHandlerQueueArn`,
    });

    // SNS Topics
    new CfnOutput(this, 'EventHandlerTopicArn', { value: eventHandlerTopic.topicArn });

    // AppSync API
    new CfnOutput(this, 'GraphQLApiUrl', { value: api.graphqlUrl });

    // EventBridge
    new CfnOutput(this, 'EventBusArn', { value: eventBus.eventBusArn });
    new CfnOutput(this, 'TransactionSavedEventRuleArn', {
      value: transactionSavedEventRule.ruleArn,
    });

    // Lambda functions
    new CfnOutput(this, 'TransactionsResolverFunctionArn', {
      value: transactionsReolverFunction.functionArn,
    });
    new CfnOutput(this, 'UpdatePositionsFunctionArn', {
      value: updatePositionsFunction.functionArn,
    });
  }
}

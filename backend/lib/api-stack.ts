import * as path from 'path';
import { Stack, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Effect, Role, ServicePrincipal, PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Alarm, Metric, ComparisonOperator, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import {
  Code,
  GraphqlApi,
  FieldLogLevel,
  InlineCode,
  AuthorizationType,
  DynamoDbDataSource,
  FunctionRuntime,
  AppsyncFunction,
  Resolver,
  Definition,
  EventBridgeDataSource,
} from 'aws-cdk-lib/aws-appsync';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PecuniaryApiStackProps } from './types/PecuniaryStackProps';
import { LayerVersion, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

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

    // UpdateInvestmentAccount DLQ
    const updateInvestmentAccountDLQ = new Queue(this, 'UpdateInvestmentAccountDLQ', {
      queueName: `${props.appName}-${props.envName}-updateInvestmentAccountDLQ`,
    });

    // UpdateBankAccount DLQ
    const updateBankAccountDLQ = new Queue(this, 'UpdateBankAccountDLQ', {
      queueName: `${props.appName}-${props.envName}-updateBankAccountDLQ`,
    });

    /***
     *** AWS SNS - Topics
     ***/

    const updateInvestmentAccountTopic = new Topic(this, 'UpdateInvestmentAccountTopic', {
      topicName: `${props.appName}-${props.envName}-updateInvestmentAccountTopic`,
      displayName: 'Update Investment Account DLQ Notification',
    });

    const updateBankAccountTopic = new Topic(this, 'UpdateBankAccountTopic', {
      topicName: `${props.appName}-${props.envName}-updateBankAccountTopic`,
      displayName: 'Update Bank Account Balance DLQ Notification',
    });

    if (props.params.dlqNotifications) {
      updateBankAccountTopic.addSubscription(new EmailSubscription(props.params.dlqNotifications));
      updateInvestmentAccountTopic.addSubscription(new EmailSubscription(props.params.dlqNotifications));
    }

    /***
     *** AWS CloudWatch - Alarms
     ***/

    // Generic metric
    const updateInvestmentAccountDlqMetric = new Metric({
      namespace: 'AWS/SQS',
      metricName: 'ApproximateNumberOfMessagesVisible',
      dimensionsMap: {
        QueueName: updateInvestmentAccountDLQ.queueName,
      },
      period: Duration.minutes(5),
      statistic: 'Sum',
    });
    const updateInvestmentAccountAlarm = new Alarm(this, 'UpdateInvestmentAccountAlarm', {
      alarmName: `${props.appName}-${props.envName}-updateInvestmentAccountAlarm`,
      alarmDescription: 'Unable to update investment account',
      metric: updateInvestmentAccountDlqMetric,
      datapointsToAlarm: 1,
      evaluationPeriods: 12,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });
    updateInvestmentAccountAlarm.addAlarmAction(new SnsAction(updateInvestmentAccountTopic));

    const updateBankAccountDlqMetric = new Metric({
      namespace: 'AWS/SQS',
      metricName: 'ApproximateNumberOfMessagesVisible',
      dimensionsMap: {
        QueueName: updateBankAccountDLQ.queueName,
      },
      period: Duration.minutes(5),
      statistic: 'Sum',
    });
    const updateBankAccountAlarm = new Alarm(this, 'UpdateBankAccountAlarm', {
      alarmName: `${props.appName}-${props.envName}-updateBankAccountAlarm`,
      alarmDescription: 'Unable to update bank account',
      metric: updateBankAccountDlqMetric,
      datapointsToAlarm: 1,
      evaluationPeriods: 12,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });
    updateBankAccountAlarm.addAlarmAction(new SnsAction(updateBankAccountTopic));

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
      definition: Definition.fromFile(path.join(__dirname, '../src/appsync/schema.graphql')),
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
        roleName: `${props.appName}-appsync-dynamodb-service-role-${props.envName}`,
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

    // AppSync EventBridge DataSource
    const eventBridgeDataSource = new EventBridgeDataSource(this, 'EventBridgeDataSource', {
      api,
      eventBus: eventBus,
      description: 'EventBridgeDataSource',
      name: 'eventBridgeDataSource',
      serviceRole: new Role(this, `${props.appName}AppSyncEventBridgeServiceRole`, {
        assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
        roleName: `${props.appName}-appsync-event-bridge-service-role-${props.envName}`,
        inlinePolicies: {
          name: new PolicyDocument({
            statements: [
              new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['events:PutEvents'],
                resources: [eventBus.eventBusArn],
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
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const updateAccountFunction = new AppsyncFunction(this, 'updateAccountFunction', {
      name: 'updateAccount',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updateAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getAccountFunction = new AppsyncFunction(this, 'getAccountFunction', {
      name: 'getAccount',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getAccountsFunction = new AppsyncFunction(this, 'getAccountsFunction', {
      name: 'getAccounts',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getAccounts.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getAggregateFunction = new AppsyncFunction(this, 'getAggregateFunction', {
      name: 'getAggregate',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getAggregate.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const deleteAccountFunction = new AppsyncFunction(this, 'deleteAccountFunction', {
      name: 'deleteAccount',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.deleteAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getBankTransactionsFunction = new AppsyncFunction(this, 'getBankTransactionsFunction', {
      name: 'getBankTransactions',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getBankTransactions.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getInvestmentTransactionsFunction = new AppsyncFunction(this, 'getInvestmentTransactionsFunction', {
      name: 'getInvestmentTransactions',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getInvestmentTransactions.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const createCategoryFunction = new AppsyncFunction(this, 'createCategoryFunction', {
      name: 'createCategory',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createCategory.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const updateCategoryFunction = new AppsyncFunction(this, 'updateCategoryFunction', {
      name: 'updateCategory',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updateCategory.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getCategoriesFunction = new AppsyncFunction(this, 'getCategoriesFunction', {
      name: 'getCategories',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getCategories.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const createPayeeFunction = new AppsyncFunction(this, 'createPayeeFunction', {
      name: 'createPayee',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createPayee.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const updatePayeeFunction = new AppsyncFunction(this, 'updatePayeeFunction', {
      name: 'updatePayee',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updatePayee.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getPayeesFunction = new AppsyncFunction(this, 'getPayeesFunction', {
      name: 'getPayees',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getPayees.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const createSymbolFunction = new AppsyncFunction(this, 'createSymbolFunction', {
      name: 'createSymbol',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createSymbol.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getSymbolsFunction = new AppsyncFunction(this, 'getSymbolsFunction', {
      name: 'getSymbols',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getSymbols.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const publishEvent = new AppsyncFunction(this, 'publishEvent', {
      name: 'publishEvent',
      api: api,
      dataSource: eventBridgeDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Event.publishEvent.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });

    const createBankTransaction = new AppsyncFunction(this, 'createBankTransactionFunction', {
      name: 'createBankTransaction',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createBankTransaction.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const updateBankTransaction = new AppsyncFunction(this, 'updateBankTransactionFunction', {
      name: 'updateBankTransaction',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updateBankTransaction.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const deleteBankTransaction = new AppsyncFunction(this, 'deleteBankTransactionFunction', {
      name: 'deleteBankTransaction',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.deleteBankTransaction.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const createInvestmentTransaction = new AppsyncFunction(this, 'createInvestmentTransactionFunction', {
      name: 'createInvestmentTransaction',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createInvestmentTransaction.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const updateInvestmentTransaction = new AppsyncFunction(this, 'updateInvestmentTransactionFunction', {
      name: 'updateInvestmentTransaction',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updateInvestmentTransaction.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const deleteInvestmentTransaction = new AppsyncFunction(this, 'deleteInvestmentTransactionFunction', {
      name: 'deleteInvestmentTransaction',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.deleteInvestmentTransaction.js')),
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
    const deleteAccountResolver = new Resolver(this, 'deleteAccountResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'deleteAccount',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getAggregateFunction, deleteAccountFunction],
      code: passthrough,
    });
    const getBankTransactionResolver = new Resolver(this, 'getBankTransactionsResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getBankTransactions',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getBankTransactionsFunction],
      code: passthrough,
    });
    const getInvestmentTransactionResolver = new Resolver(this, 'getInvestmentTransactionsResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getInvestmentTransactions',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getInvestmentTransactionsFunction],
      code: passthrough,
    });
    const createCategoryResolver = new Resolver(this, 'createCategoryResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'createCategory',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createCategoryFunction],
      code: passthrough,
    });
    const updateCategoryResolver = new Resolver(this, 'updateCategoryResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'updateCategory',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [updateCategoryFunction],
      code: passthrough,
    });
    const getCategoriesResolver = new Resolver(this, 'getCategoriesResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getCategories',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getCategoriesFunction],
      code: passthrough,
    });
    const createPayeeResolver = new Resolver(this, 'createPayeeResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'createPayee',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createPayeeFunction],
      code: passthrough,
    });
    const updatePayeeResolver = new Resolver(this, 'updatePayeeResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'updatePayee',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [updatePayeeFunction],
      code: passthrough,
    });
    const getPayeesResolver = new Resolver(this, 'getPayeesResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getPayees',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getPayeesFunction],
      code: passthrough,
    });
    const createSymbolResolver = new Resolver(this, 'createSymbolResolver', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'createSymbol',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createSymbolFunction],
      code: passthrough,
    });
    const getSymbolsResolver = new Resolver(this, 'getSymbolsResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getSymbols',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getSymbolsFunction],
      code: passthrough,
    });
    const createBankTransactionResolver = new Resolver(this, 'createBankTransaction', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'createBankTransaction',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createBankTransaction, publishEvent],
      code: passthrough,
    });
    const updateBankTransactionResolver = new Resolver(this, 'updateBankTransaction', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'updateBankTransaction',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [updateBankTransaction, publishEvent],
      code: passthrough,
    });
    const deleteBankTransactionResolver = new Resolver(this, 'deleteBankTransaction', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'deleteBankTransaction',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [deleteBankTransaction, publishEvent],
      code: passthrough,
    });
    const createInvestmentTransactionResolver = new Resolver(this, 'createInvestmentTransaction', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'createInvestmentTransaction',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createInvestmentTransaction, publishEvent],
      code: passthrough,
    });
    const updateInvestmentTransactionResolver = new Resolver(this, 'updateInvestmentTransaction', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'updateInvestmentTransaction',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [updateInvestmentTransaction, publishEvent],
      code: passthrough,
    });
    const deleteInvestmentTransactionResolver = new Resolver(this, 'deleteInvestmentTransaction', {
      api: api,
      typeName: 'Mutation',
      fieldName: 'deleteInvestmentTransaction',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [deleteInvestmentTransaction, publishEvent],
      code: passthrough,
    });

    /***
     *** AWS Lambda - Event Handlers
     ***/

    // AWS ADOT Lambda layer
    const adotJavscriptLayer = LayerVersion.fromLayerVersionArn(
      this,
      'adotJavascriptLayer',
      `arn:aws:lambda:${Stack.of(this).region}:901920570463:layer:aws-otel-nodejs-amd64-ver-1-18-1:4`
    );

    const updateBankAccountFunction = new NodejsFunction(this, 'UpdateBankBalance', {
      runtime: Runtime.NODEJS_22_X,
      functionName: `${props.appName}-${props.envName}-UpdateBankAccount`,
      handler: 'handler',
      entry: path.resolve(__dirname, '../src/lambda/updateBankAccount/main.ts'),
      memorySize: 384,
      timeout: Duration.seconds(5),
      tracing: Tracing.ACTIVE,
      layers: [adotJavscriptLayer],
      environment: {
        REGION: Stack.of(this).region,
        DATA_TABLE_NAME: dataTable.tableName,
        AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-handler',
      },
      deadLetterQueue: updateBankAccountDLQ,
    });
    // Add permissions to call DynamoDB
    updateBankAccountFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:UpdateItem'],
        resources: [dataTable.tableArn],
      })
    );

    const updateInvestmentAccountFunction = new NodejsFunction(this, 'UpdateInvestmentAccount', {
      runtime: Runtime.NODEJS_22_X,
      functionName: `${props.appName}-${props.envName}-UpdateInvestmentAccount`,
      handler: 'handler',
      entry: path.resolve(__dirname, '../src/lambda/updateInvestmentAccount/main.ts'),
      memorySize: 1024,
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
      // layers: [adotJavscriptLayer],
      environment: {
        REGION: Stack.of(this).region,
        DATA_TABLE_NAME: dataTable.tableName,
        // AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-handler',
      },
      deadLetterQueue: updateInvestmentAccountDLQ,
    });
    // Add permissions to call DynamoDB
    updateInvestmentAccountFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Query'],
        resources: [dataTable.tableArn, dataTable.tableArn + '/index/accountId-gsi', dataTable.tableArn + '/index/transaction-gsi'],
      })
    );
    updateInvestmentAccountFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem'],
        resources: [dataTable.tableArn],
      })
    );
    // Add permission to send to EventBridge
    updateInvestmentAccountFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        resources: [eventBus.eventBusArn],
      })
    );
    // Add permission send message to SQS
    updateInvestmentAccountFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['SQS:SendMessage', 'SNS:Publish'],
        resources: [updateInvestmentAccountDLQ.queueArn],
      })
    );

    /***
     *** AWS EventBridge - Event Bus Rules
     ***/

    // EventBus Rule - InvestmentTransactionSavedEventRule
    const investmentTransactionSavedRule = new Rule(this, 'InvestmentTransactionSavedEventRule', {
      ruleName: `${props.appName}-InvestmentTransactionSavedEvent-${props.envName}`,
      description: 'InvestmentTransactionSavedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['InvestmentTransactionSavedEvent'],
      },
    });
    investmentTransactionSavedRule.addTarget(
      new LambdaFunction(updateInvestmentAccountFunction, {
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );

    // EventBus Rule - BankTransactionSavedEvent
    const transactionUpdatedEventRule = new Rule(this, 'BankTransactionSavedEvent', {
      ruleName: `${props.appName}-BankTransactionSavedEvent-${props.envName}`,
      description: 'BankTransactionSavedEvent',
      eventBus: eventBus,
      eventPattern: {
        source: ['custom.pecuniary'],
        detailType: ['BankTransactionSavedEvent'],
      },
    });
    transactionUpdatedEventRule.addTarget(
      new LambdaFunction(updateBankAccountFunction, {
        maxEventAge: Duration.hours(2),
        retryAttempts: 2,
      })
    );
    /***
     *** Outputs
     ***/

    // Dead Letter Queues
    new CfnOutput(this, 'UpdateInvestmentAccountDLQArn', {
      value: updateInvestmentAccountDLQ.queueArn,
      exportName: `${props.appName}-${props.envName}-updateInvestmentAccountDLQ`,
    });
    new CfnOutput(this, 'UpdateBankAccountDLQArn', {
      value: updateBankAccountDLQ.queueArn,
      exportName: `${props.appName}-${props.envName}-updateBankAccountDLQ`,
    });

    // SNS Topics
    new CfnOutput(this, 'UpdateBankAccountTopicArn', { value: updateBankAccountTopic.topicArn });
    new CfnOutput(this, 'UpdateInvestmentAccountTopicArn', { value: updateInvestmentAccountTopic.topicArn });

    // AppSync API
    new CfnOutput(this, 'GraphQLApiUrl', { value: api.graphqlUrl });

    // EventBridge
    new CfnOutput(this, 'EventBusArn', { value: eventBus.eventBusArn });
    new CfnOutput(this, 'InvestmentTransactionSavedRuleArn', {
      value: investmentTransactionSavedRule.ruleArn,
    });
    new CfnOutput(this, 'TransactionUpdatedEventRule', {
      value: transactionUpdatedEventRule.ruleArn,
    });
  }
}

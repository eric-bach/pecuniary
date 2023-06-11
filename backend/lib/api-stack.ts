import * as path from 'path';
import { Stack, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement, Effect, Role, ServicePrincipal, PolicyDocument } from 'aws-cdk-lib/aws-iam';
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
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { PecuniaryApiStackProps } from './types/PecuniaryStackProps';

const dotenv = require('dotenv');
dotenv.config();

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: PecuniaryApiStackProps) {
    super(scope, id, props);

    const REGION = Stack.of(this).region;
    const userPool = UserPool.fromUserPoolId(this, 'userPool', props.params.userPoolId);
    const dataTable = Table.fromTableArn(this, 'table', props.params.dataTableArn);
    const eventHandlerQueue = Queue.fromQueueArn(this, 'eventHandlerQueue', props.params.eventHandlerQueueArn);
    const eventBus = EventBus.fromEventBusArn(this, 'eventBus', props.params.eventBusArn);

    /***
     *** AWS AppSync
     ***/

    const api = new GraphqlApi(this, 'PecuniaryApi', {
      name: `${props.appName}-${props.envName}-api`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      schema: SchemaFile.fromAsset(path.join(__dirname, './graphql/schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      },
    });

    // AppSync DataSources
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
      code: Code.fromAsset(path.join(__dirname, '/graphql/Mutation.createAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getAccountFunction = new AppsyncFunction(this, 'getAccountFunction', {
      name: 'getAccount',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '/graphql/Query.getAccount.js')),
      runtime: FunctionRuntime.JS_1_0_0,
    });
    const getAccountDetailFunction = new AppsyncFunction(this, 'getAccountDetailFunction', {
      name: 'getAccountDetail',
      api: api,
      dataSource: dynamoDbDataSource,
      code: Code.fromAsset(path.join(__dirname, '/graphql/Query.getAccountDetail.js')),
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
    const getAccountResolver = new Resolver(this, 'getAccountResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getAccount',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getAccountFunction],
      code: passthrough,
    });
    const getAccountDetailResolver = new Resolver(this, 'getAccountDetailResolver', {
      api: api,
      typeName: 'Query',
      fieldName: 'getAccountDetail',
      runtime: FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getAccountDetailFunction],
      code: passthrough,
    });

    // /***
    //  *** AWS AppSync resolvers - AWS Lambda
    //  ***/

    // // Resolver for Accounts
    // const accountsResolverFunction = new NodejsFunction(this, 'AccountsResolver', {
    //   functionName: `${props.appName}-${props.envName}-AccountsResolver`,
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: 'handler',
    //   entry: path.resolve(__dirname, '../src/lambda/accountsResolver/main.ts'),
    //   memorySize: 512,
    //   timeout: Duration.seconds(10),
    //   environment: {
    //     DATA_TABLE_NAME: dataTable.tableName,
    //     REGION: REGION,
    //   },
    //   //deadLetterQueue: commandHandlerQueue,
    // });
    // // Add permissions to DynamoDB table
    // accountsResolverFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
    //     resources: [dataTable.tableArn],
    //   })
    // );
    // accountsResolverFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['dynamodb:Query'],
    //     resources: [dataTable.tableArn, dataTable.tableArn + '/index/aggregateId-lsi'],
    //   })
    // );
    // // Set the new Lambda function as a data source for the AppSync API
    // const accountsResolverDataSource = api.addLambdaDataSource('accountsDataSource', accountsResolverFunction, {
    //   name: 'AccountsLambdaDataSource',
    // });
    // // Resolvers
    // accountsResolverDataSource.createResolver(`${props.appName}-${props.envName}-getAccountsResolver`, {
    //   typeName: 'Query',
    //   fieldName: 'getAccounts',
    // });
    // accountsResolverDataSource.createResolver('createAccountResolver', {
    //   typeName: 'Mutation',
    //   fieldName: 'createAccount',
    // });
    // accountsResolverDataSource.createResolver('updateAccountResolver', {
    //   typeName: 'Mutation',
    //   fieldName: 'updateAccount',
    // });
    // accountsResolverDataSource.createResolver('deleteAccountResolver', {
    //   typeName: 'Mutation',
    //   fieldName: 'deleteAccount',
    // });

    // // Resolver for Transactions
    // const transactionsReolverFunction = new NodejsFunction(this, 'TransactionsResolver', {
    //   functionName: `${props.appName}-${props.envName}-TransactionsResolver`,
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: 'handler',
    //   entry: path.resolve(__dirname, '../src/lambda/transactionsResolver/main.ts'),
    //   memorySize: 512,
    //   timeout: Duration.seconds(10),
    //   environment: {
    //     DATA_TABLE_NAME: dataTable.tableName,
    //     EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
    //     REGION: REGION,
    //   },
    //   //deadLetterQueue: commandHandlerQueue,
    // });
    // // Add permissions to DynamoDB table
    // transactionsReolverFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
    //     resources: [dataTable.tableArn],
    //   })
    // );
    // transactionsReolverFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['dynamodb:Query'],
    //     resources: [dataTable.tableArn, dataTable.tableArn + '/index/aggregateId-lsi', dataTable.tableArn + '/index/aggregateId-gsi'],
    //   })
    // );
    // // Add permission to send to EventBridge
    // transactionsReolverFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['events:PutEvents'],
    //     resources: [eventBus.eventBusArn],
    //   })
    // );
    // // Set the new Lambda function as a data source for the AppSync API
    // const transactionsResolverDataSource = api.addLambdaDataSource('transactionsDataSource', transactionsReolverFunction, {
    //   name: 'TransactionsLambdaDataSource',
    // });
    // // Resolvers
    // transactionsResolverDataSource.createResolver('getTransactionResolver', {
    //   typeName: 'Query',
    //   fieldName: 'getTransactions',
    // });
    // transactionsResolverDataSource.createResolver('createTransactionResolver', {
    //   typeName: 'Mutation',
    //   fieldName: 'createTransaction',
    // });
    // transactionsResolverDataSource.createResolver('updateTransactionResolver', {
    //   typeName: 'Mutation',
    //   fieldName: 'updateTransaction',
    // });
    // transactionsResolverDataSource.createResolver('deleteTransactionResolver', {
    //   typeName: 'Mutation',
    //   fieldName: 'deleteTransaction',
    // });

    // // Resolver for Positions
    // const positionsResolverFunction = new NodejsFunction(this, 'PositionsResolver', {
    //   functionName: `${props.appName}-${props.envName}-PositionsResolver`,
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: 'handler',
    //   entry: path.resolve(__dirname, '../src/lambda/positionsResolver/main.ts'),
    //   memorySize: 512,
    //   timeout: Duration.seconds(10),
    //   environment: {
    //     DATA_TABLE_NAME: dataTable.tableName,
    //     REGION: REGION,
    //   },
    //   //deadLetterQueue: commandHandlerQueue,
    // });
    // // Add permissions to DynamoDB table
    // positionsResolverFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['dynamodb:Query'],
    //     resources: [dataTable.tableArn],
    //   })
    // );
    // // Set the new Lambda function as a data source for the AppSync API
    // const positionsResolverDataSource = api.addLambdaDataSource('positionsDataSource', positionsResolverFunction, {
    //   name: 'GetPositionsLambdaResolver',
    // });
    // // Resolvers
    // positionsResolverDataSource.createResolver('getPositionsResolver', {
    //   typeName: 'Query',
    //   fieldName: 'getPositions',
    // });

    // /***
    //  *** AWS Lambda - Event Handlers
    //  ***/

    // const updatePositionsFunction = new NodejsFunction(this, 'UpdatePositions', {
    //   runtime: Runtime.NODEJS_18_X,
    //   functionName: `${props.appName}-${props.envName}-UpdatePositions`,
    //   handler: 'handler',
    //   entry: path.resolve(__dirname, '../src/lambda/updatePositions/main.ts'),
    //   memorySize: 1024,
    //   timeout: Duration.seconds(10),
    //   environment: {
    //     DATA_TABLE_NAME: dataTable.tableName,
    //     EVENTBUS_PECUNIARY_NAME: eventBus.eventBusName,
    //     REGION: REGION,
    //   },
    //   deadLetterQueue: eventHandlerQueue,
    // });
    // // Add permissions to call DynamoDB
    // updatePositionsFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['dynamodb:Query'],
    //     resources: [dataTable.tableArn, dataTable.tableArn + '/index/aggregateId-lsi', dataTable.tableArn + '/index/aggregateId-gsi'],
    //   })
    // );
    // updatePositionsFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem'],
    //     resources: [dataTable.tableArn],
    //   })
    // );
    // // Add permission to send to EventBridge
    // updatePositionsFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['events:PutEvents'],
    //     resources: [eventBus.eventBusArn],
    //   })
    // );
    // // Add permission send message to SQS
    // updatePositionsFunction.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ['SQS:SendMessage', 'SNS:Publish'],
    //     resources: [eventHandlerQueue.queueArn],
    //   })
    // );

    /***
     *** AWS EventBridge - Event Bus Rules
     ***/

    // // EventBus Rule - TransactionSavedEventRule
    // const transactionSavedEventRule = new Rule(this, 'TransactionSavedEventRule', {
    //   ruleName: `${props.appName}-TransactionSavedEvent-${props.envName}`,
    //   description: 'TransactionSavedEvent',
    //   eventBus: eventBus,
    //   eventPattern: {
    //     source: ['custom.pecuniary'],
    //     detailType: ['TransactionSavedEvent'],
    //   },
    // });
    // transactionSavedEventRule.addTarget(
    //   new LambdaFunction(updatePositionsFunction, {
    //     //deadLetterQueue: SqsQueue,
    //     maxEventAge: Duration.hours(2),
    //     retryAttempts: 2,
    //   })
    // );

    /***
     *** Outputs
     ***/

    // AppSync API
    new CfnOutput(this, 'GraphQLApiUrl', { value: api.graphqlUrl });

    // EventBridge
    new CfnOutput(this, 'EventBusArn', { value: eventBus.eventBusArn });
    // new CfnOutput(this, 'TransactionSavedEventRuleArn', {
    //   value: transactionSavedEventRule.ruleArn,
    // });

    // // Lambda functions
    // new CfnOutput(this, 'AccountResolverFunctionArn', {
    //   value: accountsResolverFunction.functionArn,
    // });
    // new CfnOutput(this, 'TransactionsResolverFunctionArn', {
    //   value: transactionsReolverFunction.functionArn,
    // });
    // new CfnOutput(this, 'PositionsResolverFunctionArn', {
    //   value: positionsResolverFunction.functionArn,
    // });
    // new CfnOutput(this, 'UpdatePositionsFunctionArn', {
    //   value: updatePositionsFunction.functionArn,
    // });
  }
}

import { Stack, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { GraphqlApi, FieldLogLevel, AuthorizationType, Schema } from '@aws-cdk/aws-appsync-alpha';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

const dotenv = require('dotenv');
import * as path from 'path';
import { PecuniaryApiStackProps } from './types/PecuniaryStackProps';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

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
        resources: [dataTable.tableArn, dataTable.tableArn + '/index/aggregateId-lsi'],
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
        resources: [dataTable.tableArn, dataTable.tableArn + '/index/aggregateId-lsi', dataTable.tableArn + '/index/aggregateId-gsi'],
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
        resources: [dataTable.tableArn],
      })
    );
    // Set the new Lambda function as a data source for the AppSync API
    const positionsResolverDataSource = api.addLambdaDataSource('positionsDataSource', positionsResolverFunction);
    // Resolvers
    positionsResolverDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getPositions',
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

    // AppSync API
    new CfnOutput(this, 'GraphQLApiUrl', { value: api.graphqlUrl });

    // EventBridge
    new CfnOutput(this, 'EventBusArn', { value: eventBus.eventBusArn });
    new CfnOutput(this, 'TransactionSavedEventRuleArn', { value: transactionSavedEventRule.ruleArn });

    // Lambda functions
    new CfnOutput(this, 'AccountResolverFunctionArn', { value: accountsResolverFunction.functionArn });
    new CfnOutput(this, 'TransactionsResolverFunctionArn', { value: transactionsReolverFunction.functionArn });
    new CfnOutput(this, 'PositionsResolverFunctionArn', { value: positionsResolverFunction.functionArn });
    new CfnOutput(this, 'UpdatePositionsFunctionArn', { value: updatePositionsFunction.functionArn });
  }
}

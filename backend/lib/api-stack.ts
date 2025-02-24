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
  AuthorizationType,
  DynamoDbDataSource,
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
import { AppsyncResolver } from './constructs/appsyncResolver';

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
      period: Duration.minutes(60),
      statistic: 'Sum',
    });
    const updateInvestmentAccountAlarm = new Alarm(this, 'UpdateInvestmentAccountAlarm', {
      alarmName: `${props.appName}-${props.envName}-updateInvestmentAccountAlarm`,
      alarmDescription: 'Unable to update investment account',
      metric: updateInvestmentAccountDlqMetric,
      datapointsToAlarm: 1,
      evaluationPeriods: 1,
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
      period: Duration.minutes(60),
      statistic: 'Sum',
    });
    const updateBankAccountAlarm = new Alarm(this, 'UpdateBankAccountAlarm', {
      alarmName: `${props.appName}-${props.envName}-updateBankAccountAlarm`,
      alarmDescription: 'Unable to update bank account',
      metric: updateBankAccountDlqMetric,
      datapointsToAlarm: 1,
      evaluationPeriods: 1,
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
    const getAggregateResolver = new AppsyncResolver(this, 'getAggregate', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'getAggregate',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getAggregate.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const createAccountResolver = new AppsyncResolver(this, 'createAccount', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'createAccount',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createAccount.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    const updateAccountResolver = new AppsyncResolver(this, 'updateAccount', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'updateAccount',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updateAccount.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    const deleteAccountResolver = new AppsyncResolver(this, 'deleteAccount', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'deleteAccount',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.deleteAccount.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: { pre: [getAggregateResolver.function] },
      },
    });

    const getAccountResolver = new AppsyncResolver(this, 'getAccount', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'getAccount',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getAccount.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const getAccountsResolver = new AppsyncResolver(this, 'getAccounts', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'getAccounts',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getAccounts.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const getBankTransactionsResolver = new AppsyncResolver(this, 'getBankTransactions', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'getBankTransactions',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getBankTransactions.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const getInvestmentTransactionsResolver = new AppsyncResolver(this, 'getInvestmentTransactions', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'getInvestmentTransactions',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getInvestmentTransactions.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const createCategoryResolver = new AppsyncResolver(this, 'createCategory', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'createCategory',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createCategory.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    const updateCategoryResolver = new AppsyncResolver(this, 'updateCategory', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'updateCategory',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updateCategory.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    const getCategoriesResolver = new AppsyncResolver(this, 'getCategories', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'getCategories',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getCategories.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const createPayeeResolver = new AppsyncResolver(this, 'createPayee', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'createPayee',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createPayee.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    const updatePayeeResolver = new AppsyncResolver(this, 'updatePayee', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'updatePayee',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updatePayee.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    const getPayeesResolver = new AppsyncResolver(this, 'getPayees', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'getPayees',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getPayees.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const createSymbolResolver = new AppsyncResolver(this, 'createSymbol', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'createSymbol',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createSymbol.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    const getSymbolsResolver = new AppsyncResolver(this, 'getSymbols', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'getSymbols',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Query.getSymbols.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const publishEventResolver = new AppsyncResolver(this, 'publishEvent', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'publishEvent',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Event.publishEvent.js')),
      },
    });

    const createBankTransactionResolver = new AppsyncResolver(this, 'createBankTransaction', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'createBankTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createBankTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    const upodateBankTransactionResolver = new AppsyncResolver(this, 'updateBankTransaction', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'updateBankTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updateBankTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    const delteBankTransactionResolver = new AppsyncResolver(this, 'deleteBankTransaction', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'deleteBankTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.deleteBankTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    const createInvestmentTransactionResolver = new AppsyncResolver(this, 'createInvestmentTransaction', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'createInvestmentTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.createInvestmentTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    const upodateInvestmentTransactionResolver = new AppsyncResolver(this, 'updateInvestmentTransaction', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'updateInvestmentTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.updateInvestmentTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    const delteInvestmentTransactionResolver = new AppsyncResolver(this, 'deleteInvestmentTransaction', {
      api,
      dataSource: dynamoDbDataSource,
      name: 'deleteInvestmentTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../src/appsync/build/Mutation.deleteInvestmentTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
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

    const updateBankAccountFunction = new NodejsFunction(this, 'UpdateBankAccount', {
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

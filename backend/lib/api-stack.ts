import { Duration, Stack } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { PecuniaryApiStackProps } from './types/PecuniaryStackProps';

const dotenv = require('dotenv');

dotenv.config();

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: PecuniaryApiStackProps) {
    super(scope, id, props);

    const REGION = Stack.of(this).region;
    const dataTable = Table.fromTableArn(this, 'table', props.params.dataTableArn);

    const accountsResolverFunction = new NodejsFunction(this, 'AccountsResolver', {
      functionName: `${props.appName}-${props.envName}-AccountsResolver`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.resolve(__dirname, '../src/lambda/accountsResolver/main.ts'),
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
  }
}

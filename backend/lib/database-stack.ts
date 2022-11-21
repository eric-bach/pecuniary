import { Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, BillingMode, AttributeType } from 'aws-cdk-lib/aws-dynamodb';

const dotenv = require('dotenv');
import { BaseStackProps as BaseStackProps } from './types/StackProps';

dotenv.config();

export class DatabaseStack extends Stack {
  public ordersTableArn: string;

  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    const ordersTable = new Table(this, 'orders', {
      tableName: `${props.appName}-${props.envName}-orders`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },

      removalPolicy: RemovalPolicy.DESTROY,
    });


    new CfnOutput(this, 'OrdersTableArn', { value: ordersTable.tableArn, exportName: `${props.appName}-${props.envName}-ordersTableArn` });
    new CfnOutput(this, 'OrdersTableName', { value: ordersTable.tableName, exportName: `${props.appName}-${props.envName}-ordersTableName` });


    this.ordersTableArn = ordersTable.tableArn;
  }
}
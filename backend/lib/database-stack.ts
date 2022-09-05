import { Stack, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, BillingMode, AttributeType } from 'aws-cdk-lib/aws-dynamodb';

const dotenv = require('dotenv');
import { PecuniaryStackProps } from './PecuniaryStackProps';

dotenv.config();

export class DatabaseStack extends Stack {
  public dataTableArn: string;
  public dataTableName: string;

  constructor(scope: Construct, id: string, props: PecuniaryStackProps) {
    super(scope, id, props);

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
        name: 'sk',
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
    // GSIs for Data Table
    dataTable.addGlobalSecondaryIndex({
      indexName: 'aggregateId-gsi',
      partitionKey: {
        name: 'aggregateId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'transactionDate',
        type: AttributeType.STRING,
      },
    });

    /***
     *** Outputs
     ***/

    // DynamoDB tables
    new CfnOutput(this, 'DataTableArn', { value: dataTable.tableArn, exportName: `${props.appName}-${props.envName}-dataTableArn` });
    new CfnOutput(this, 'DataTableName', { value: dataTable.tableName, exportName: `${props.appName}-${props.envName}-dataTableName` });

    /***
     *** Exports
     ***/

    this.dataTableArn = dataTable.tableArn;
    this.dataTableName = dataTable.tableName;
  }
}

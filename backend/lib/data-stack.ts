import { CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, BillingMode, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  UserPool,
  CfnUserPoolGroup,
  UserPoolClient,
  AccountRecovery,
  VerificationEmailStyle,
  UserPoolDomain,
} from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Policy } from 'aws-cdk-lib/aws-iam';
import { PecuniaryBaseStackProps } from './types/PecuniaryStackProps';
import VERIFICATION_EMAIL_TEMPLATE from './emails/verificationEmail';

import * as path from 'path';
const dotenv = require('dotenv');

dotenv.config();

export class DataStack extends Stack {
  public userPoolId: string;
  public dataTableArn: string;

  constructor(scope: Construct, id: string, props: PecuniaryBaseStackProps) {
    super(scope, id, props);

    const REGION = Stack.of(this).region;

    /***
     *** AWS Lambda - Cognito post-confirmation trigger
     ***/

    // AWS Cognito post-confirmation lambda function
    const cognitoPostConfirmationTrigger = new NodejsFunction(this, 'CognitoPostConfirmationTrigger', {
      runtime: Runtime.NODEJS_18_X,
      functionName: `${props.appName}-${props.envName}-CognitoPostConfirmationTrigger`,
      handler: 'handler',
      entry: path.resolve(__dirname, '../src/lambda/cognitoPostConfirmation/main.ts'),
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
    new CfnUserPoolGroup(this, 'PecuniaryUserGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'Users',
      description: 'Pecuniary Users',
    });

    // Cognito user pool domain
    new UserPoolDomain(this, 'PecuniaryUserPoolDomain', {
      userPool: userPool,
      cognitoDomain: {
        domainPrefix: `${props.appName}-${props.envName}`,
      },
    });

    // Cognito user client
    const userPoolClient = new UserPoolClient(this, 'PecuniaryUserClient', {
      userPoolClientName: `${props.appName}_user_client`,
      accessTokenValidity: Duration.hours(8),
      idTokenValidity: Duration.hours(8),
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
     *** AWS DynamoDB
     ***/

    const dataTable = new Table(this, 'Data', {
      tableName: `${props.appName}-data-${props.envName}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    // GSIs for Data Table
    dataTable.addGlobalSecondaryIndex({
      indexName: 'accountId-gsi',
      partitionKey: {
        name: 'accountId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'updatedAt',
        type: AttributeType.STRING,
      },
    });
    dataTable.addGlobalSecondaryIndex({
      indexName: 'userId-gsi',
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'updatedAt',
        type: AttributeType.STRING,
      },
    });
    dataTable.addGlobalSecondaryIndex({
      indexName: 'transaction-gsi',
      partitionKey: {
        name: 'accountId',
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

    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId, exportName: `${props.appName}-${props.envName}-userPoolId` });
    new CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new CfnOutput(this, 'CognitoPostConfirmationFunctionArn', { value: cognitoPostConfirmationTrigger.functionArn });

    new CfnOutput(this, 'DataTableArn', { value: dataTable.tableArn, exportName: `${props.appName}-${props.envName}-dataTableArn` });
    new CfnOutput(this, 'DataTableName', { value: dataTable.tableName, exportName: `${props.appName}-${props.envName}-dataTableName` });

    /***
     *** Properties
     ***/

    this.userPoolId = userPool.userPoolId;
    this.dataTableArn = dataTable.tableArn;
  }
}

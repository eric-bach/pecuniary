import { Duration, Stack } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { PecuniaryApiStackProps } from './types/PecuniaryStackProps';
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: PecuniaryApiStackProps) {
    super(scope, id, props);

    const REGION = Stack.of(this).region;
    const dataTable = Table.fromTableArn(this, 'table', props.params.dataTableArn);

    const OrderApiFunction = new NodejsFunction(this, 'OrderApi', {
      functionName: `${props.appName}-${props.envName}-OrderApi`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(
        __dirname,
        '..',
        'src',
        'lambda',
        'OrderApi',
        'index.ts'
      ),
      projectRoot: path.join(
        __dirname,
        '..',
        'src',
        'lambda',
        'OrderApi'
      ),
      depsLockFilePath: path.join(
        __dirname,
        '..',
        'src',
        'lambda',
        'OrderApi',
        'package-lock.json'
      ),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        DATA_TABLE_NAME: dataTable.tableName,
        REGION: REGION,
      },
      bundling: {
        commandHooks: {
          beforeBundling(): string[] {
            return [
            ];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [`cp ${inputDir}/openapi.yml ${outputDir}`];
          },
          beforeInstall() {
            return [];
          },
        },
      }
    });
    // Add permissions to DynamoDB table
    OrderApiFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
        resources: [dataTable.tableArn],
      })
    );
    OrderApiFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:*'],
        resources: ["*"],
      })
    );

    // 👇 create our HTTP Api
    const httpApi = new HttpApi(this, 'http-api-example', {
      description: 'HTTP API example',
      corsPreflight: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });
    // 👇 add route for GET /todos
    httpApi.addRoutes({
      path: '/v1/orders',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'get-todos-integration',
        OrderApiFunction,
      ),
    });

    // 👇 add route for POST /todos
    httpApi.addRoutes({
      path: '/v1/orders',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'posts-todos-33integration',
        OrderApiFunction,
      ),
    });

    // 👇 add route for POST /todos
    httpApi.addRoutes({
      path: '/v1/products',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'posts-todos-get',
        OrderApiFunction,
      ),
    });
  }
}

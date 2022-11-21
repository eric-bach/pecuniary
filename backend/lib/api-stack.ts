import { Duration, Stack } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { ApiStackProps as ApiStackProps } from './types/StackProps';
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const REGION = Stack.of(this).region;
    const ordersTable = Table.fromTableArn(this, 'table', props.params.ordersTableArn);

    const ordersApiFunction = new NodejsFunction(this, 'orders-api', {
      functionName: `${props.appName}-${props.envName}-orders-api`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(
        __dirname,
        '..',
        'src',
        'lambda',
        'order-api',
        'index.ts'
      ),
      projectRoot: path.join(
        __dirname,
        '..',
        'src',
        'lambda',
        'order-api'
      ),
      depsLockFilePath: path.join(
        __dirname,
        '..',
        'src',
        'lambda',
        'order-api',
        'package-lock.json'
      ),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        ORDERS_TABLE_NAME: ordersTable.tableName,
      },
      bundling: {
        commandHooks: {
          beforeBundling(): string[] {
            return [];
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

    ordersApiFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:*'],
        resources: [ordersTable.tableArn],
      })
    );

    const httpApi = new HttpApi(this, 'http-api', {
      apiName: `${props.appName}-${props.envName}-orders-api`,
      description: 'HTTP API',
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
        allowOrigins: ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://vietaws-meetup-10-cdk.bebi.store'],
      },
    });

    httpApi.addRoutes({
      path: '/v1/orders',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'get-orders-integration',
        ordersApiFunction,
      ),
    });

    httpApi.addRoutes({
      path: '/v1/orders',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'post-orders-integration',
        ordersApiFunction,
      ),
    });

    httpApi.addRoutes({
      path: '/v1/products',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'get-products-integration',
        ordersApiFunction,
      ),
    });
  }
}

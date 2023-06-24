import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { AnyPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BucketDeployment, CacheControl, ServerSideEncryption, Source, StorageClass } from 'aws-cdk-lib/aws-s3-deployment';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

import { HttpLambdaIntegration, HttpUrlIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';

export class RemixStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // TODO CloudFront to API GW (from Architect)

    // const remixFunction = new Function(this, 'remix-ssr', {
    //   functionName: 'remix-ssr',
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: 'index.handler',
    //   code: Code.fromAsset(path.resolve(__dirname, '../server')),
    //   memorySize: 256,
    //   timeout: Duration.seconds(10),
    // });

    // const hostingBucket = new Bucket(this, 'remix-bucket', {
    //   websiteIndexDocument: 'index.html',
    //   websiteErrorDocument: 'error.html',
    //   blockPublicAccess: {
    //     blockPublicAcls: false,
    //     blockPublicPolicy: false,
    //     ignorePublicAcls: false,
    //     restrictPublicBuckets: false,
    //   },
    //   removalPolicy: RemovalPolicy.DESTROY,
    // });
    // hostingBucket.addToResourcePolicy(
    //   new PolicyStatement({
    //     actions: ['s3:GetObject'],
    //     effect: Effect.ALLOW,
    //     resources: [hostingBucket.arnForObjects('*')],
    //     principals: [new AnyPrincipal()],
    //   })
    // );

    // const ssrIntegration = new HttpLambdaIntegration('ssrIntegration', remixFunction);
    // const bucketIntegration = new HttpUrlIntegration(
    //   'staticIntegration',
    //   `https://${hostingBucket.bucketName}.s3.${this.region}.amazonaws.com/{proxy}`,
    //   {
    //     method: HttpMethod.GET,
    //   }
    // );
    // const httpApi = new HttpApi(this, 'HttpApi');
    // httpApi.addRoutes({
    //   path: '/{proxy+}',
    //   methods: [HttpMethod.ANY],
    //   integration: ssrIntegration,
    // });
    // httpApi.addRoutes({
    //   path: '/_static/{proxy+}',
    //   methods: [HttpMethod.GET],
    //   integration: bucketIntegration,
    // });

    // // S3 bucket deployment
    // new BucketDeployment(this, 'remix-bucket-deployment', {
    //   sources: [Source.asset('./public')],
    //   destinationBucket: hostingBucket,
    //   retainOnDelete: false,
    //   contentLanguage: 'en',
    //   storageClass: StorageClass.INTELLIGENT_TIERING,
    //   serverSideEncryption: ServerSideEncryption.AES_256,
    //   cacheControl: [CacheControl.setPublic(), CacheControl.maxAge(Duration.minutes(1))],
    // });
  }
}

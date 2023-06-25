import { Stack, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import {
  AddBehaviorOptions,
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginRequestCookieBehavior,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestQueryStringBehavior,
  PriceClass,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import * as origin from 'aws-cdk-lib/aws-cloudfront-origins';
import * as api from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { join } from 'path';

const dotenv = require('dotenv');
import { PecuniaryFrontendStackProps } from './types/PecuniaryStackProps';

dotenv.config();

export class RemixStack extends Stack {
  readonly distributionUrlParameterName = '/remix/distribution/url';

  constructor(scope: Construct, id: string, props: PecuniaryFrontendStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'StaticAssetsBucket');

    new BucketDeployment(this, 'DeployStaticAssets', {
      sources: [Source.asset(join(__dirname, '../../client/public'))],
      destinationBucket: bucket,
      destinationKeyPrefix: '_static',
    });

    const fn = new NodejsFunction(this, 'remixSSR', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '../../client/server/index.js'),
      environment: {
        NODE_ENV: 'production',
      },
      bundling: {
        nodeModules: ['@remix-run/architect', 'react', 'react-dom'],
      },
      timeout: Duration.seconds(10),
      logRetention: RetentionDays.THREE_DAYS,
      tracing: Tracing.ACTIVE,
    });

    const integration = new HttpLambdaIntegration('RequestHandlerIntegration', fn, {
      payloadFormatVersion: api.PayloadFormatVersion.VERSION_2_0,
    });

    const httpApi = new api.HttpApi(this, 'WebsiteApi', {
      defaultIntegration: integration,
    });

    const httpApiUrl = `${httpApi.httpApiId}.execute-api.${Stack.of(this).region}.${Stack.of(this).urlSuffix}`;

    const requestHandlerOrigin = new origin.HttpOrigin(httpApiUrl);
    const originRequestPolicy = new OriginRequestPolicy(this, 'RequestHandlerPolicy', {
      originRequestPolicyName: 'website-request-handler',
      queryStringBehavior: OriginRequestQueryStringBehavior.all(),
      cookieBehavior: OriginRequestCookieBehavior.all(),
      // https://stackoverflow.com/questions/65243953/pass-query-params-from-cloudfront-to-api-gateway
      headerBehavior: OriginRequestHeaderBehavior.none(),
    });
    const requestHandlerBehavior: AddBehaviorOptions = {
      allowedMethods: AllowedMethods.ALLOW_ALL,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: CachePolicy.CACHING_DISABLED,
      originRequestPolicy,
    };

    const assetOrigin = new origin.S3Origin(bucket);
    const assetBehaviorOptions = {
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    };

    // Existing ACM certificate
    const certificate = Certificate.fromCertificateArn(this, 'Certificate', props.params.certificateArn || '');

    const distribution = new Distribution(this, 'CloudFront', {
      defaultBehavior: {
        origin: requestHandlerOrigin,
        ...requestHandlerBehavior,
      },
      priceClass: PriceClass.PRICE_CLASS_100,
    });

    distribution.addBehavior('/_static/*', assetOrigin, assetBehaviorOptions);

    new StringParameter(this, 'DistributionUrlParameter', {
      parameterName: this.distributionUrlParameterName,
      stringValue: distribution.distributionDomainName,
      tier: ParameterTier.STANDARD,
    });

    if (props.envName === 'prod') {
      // Route53 HostedZone A record
      var existingHostedZone = HostedZone.fromLookup(this, 'Zone', {
        domainName: 'ericbach.dev',
      });
      new ARecord(this, 'AliasRecord', {
        zone: existingHostedZone,
        recordName: `${props.appName}.ericbach.dev`,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      });
    }

    /***
     *** Outputs
     ***/
  }
}

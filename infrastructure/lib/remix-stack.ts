import { Stack, Duration, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import {
  AddBehaviorOptions,
  AllowedMethods,
  CachePolicy,
  Distribution,
  GeoRestriction,
  OriginRequestCookieBehavior,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestQueryStringBehavior,
  PriceClass,
  SSLMethod,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { HttpOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { HttpApi, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { join } from 'path';

const dotenv = require('dotenv');
import { PecuniaryFrontendStackProps } from './types/PecuniaryStackProps';

dotenv.config();

export class RemixStack extends Stack {
  readonly distributionUrlParameterName = '/remix/distribution/url';

  constructor(scope: Construct, id: string, props: PecuniaryFrontendStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'WebsiteHostingBucket', {
      bucketName: `${props.appName}-website-${props.envName}`,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new BucketDeployment(this, 'DeployStaticAssets', {
      sources: [Source.asset(join(__dirname, '../../frontend/public'))],
      destinationBucket: bucket,
      destinationKeyPrefix: '_static',
    });

    const remixServerFunction = new NodejsFunction(this, 'RemixServer', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      functionName: `${props.appName}-${props.envName}-RemixSSR`,
      entry: join(__dirname, '../../frontend/server/index.js'),
      environment: {
        NODE_ENV: 'production',
      },
      bundling: {
        nodeModules: ['@remix-run/architect', 'react', 'react-dom'],
      },
      timeout: Duration.seconds(10),
      logRetention: RetentionDays.ONE_YEAR,
      tracing: Tracing.ACTIVE,
    });

    const httpLambdaIntegration = new HttpLambdaIntegration('RequestHandlerIntegration', remixServerFunction, {
      payloadFormatVersion: PayloadFormatVersion.VERSION_2_0,
    });

    const httpApi = new HttpApi(this, 'WebsiteApi', {
      defaultIntegration: httpLambdaIntegration,
      apiName: `${props.appName}-${props.envName}-website`,
    });

    const httpApiUrl = `${httpApi.httpApiId}.execute-api.${Stack.of(this).region}.${Stack.of(this).urlSuffix}`;

    // Existing ACM certificate
    const certificate = Certificate.fromCertificateArn(this, 'Certificate', props.params.certificateArn || '');

    const distribution = new Distribution(this, 'CloudFrontDistribution', {
      priceClass: PriceClass.PRICE_CLASS_100,
      // Add API GW origin and behaviour
      defaultBehavior: {
        origin: new HttpOrigin(httpApiUrl),
        allowedMethods: AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        originRequestPolicy: new OriginRequestPolicy(this, 'RequestHandlerPolicy', {
          originRequestPolicyName: 'website-request-handler',
          queryStringBehavior: OriginRequestQueryStringBehavior.all(),
          cookieBehavior: OriginRequestCookieBehavior.all(),
          // https://stackoverflow.com/questions/65243953/pass-query-params-from-cloudfront-to-api-gateway
          headerBehavior: OriginRequestHeaderBehavior.none(),
        }),
      },
      geoRestriction: GeoRestriction.allowlist('CA'),
      certificate: props.envName === 'prod' ? certificate : undefined,
      domainNames: props.envName === 'prod' ? [`${props.appName}-remix.ericbach.dev`] : undefined,
      sslSupportMethod: props.envName === 'prod' ? SSLMethod.SNI : undefined,
    });

    // Add S3 origin and behaviour
    const assetOrigin = new S3Origin(bucket);
    const assetBehaviorOptions = {
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    };
    distribution.addBehavior('/_static/*', assetOrigin, assetBehaviorOptions);

    // new StringParameter(this, 'DistributionUrlParameter', {
    //   parameterName: this.distributionUrlParameterName,
    //   stringValue: distribution.distributionDomainName,
    //   tier: ParameterTier.STANDARD,
    // });

    if (props.envName === 'prod') {
      // Route53 HostedZone A record
      var existingHostedZone = HostedZone.fromLookup(this, 'Zone', {
        domainName: 'ericbach.dev',
      });
      new ARecord(this, 'AliasRecord', {
        zone: existingHostedZone,
        recordName: `${props.appName}-remix.ericbach.dev`,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      });
    }

    /***
     *** Outputs
     ***/

    new CfnOutput(this, 'BucketWebsiteUrl', { value: bucket.bucketWebsiteUrl });
    new CfnOutput(this, 'ApiWebsiteEndpointUrl', { value: httpApi.apiEndpoint });
    new CfnOutput(this, 'CloudFrontDistributionDomainName', { value: distribution.distributionDomainName });
  }
}

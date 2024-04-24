import { Stack, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PolicyStatement, CanonicalUserPrincipal } from 'aws-cdk-lib/aws-iam';
import { BucketDeployment, CacheControl, ServerSideEncryption, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { BlockPublicAccess, Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import {
  CloudFrontAllowedMethods,
  CloudFrontWebDistribution,
  GeoRestriction,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol,
  SSLMethod,
  ViewerCertificate,
} from 'aws-cdk-lib/aws-cloudfront';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

const dotenv = require('dotenv');
import { PecuniaryFrontendStackProps } from './types/PecuniaryStackProps';

dotenv.config();

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: PecuniaryFrontendStackProps) {
    super(scope, id, props);

    // Existing ACM certificate
    const certificate = Certificate.fromCertificateArn(this, 'Certificate', props.params.certificateArn || '');

    // CloudFront OAI
    const cloudfrontOAI = new OriginAccessIdentity(this, 'cloudfront-OAI', {
      comment: `OAI for ${id}`,
    });

    // S3 bucket for frontend
    const hostingBucket = new Bucket(this, `${props.appName}WebsiteHostingBucket`, {
      bucketName: `${props.appName}-website-${props.envName}`,
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedHeaders: ['Authorization', 'Content-Length'],
          allowedMethods: [HttpMethods.GET],
          allowedOrigins: ['*'],
          maxAge: 3000,
        },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Grant access to CloudFront
    hostingBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [hostingBucket.arnForObjects('*')],
        principals: [new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      })
    );

    // CloudFront distribution
    const distribution = new CloudFrontWebDistribution(this, `${props.appName}WebsiteDistribution`, {
      priceClass: PriceClass.PRICE_CLASS_100,
      defaultRootObject: 'container/latest/index.html',
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: hostingBucket,
            originAccessIdentity: cloudfrontOAI,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              defaultTtl: Duration.hours(1),
              minTtl: Duration.seconds(0),
              maxTtl: Duration.days(1),
              compress: true,
              allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
            },
          ],
        },
      ],
      geoRestriction: GeoRestriction.allowlist('CA'),
      errorConfigurations: [
        {
          errorCode: 403,
          errorCachingMinTtl: 60,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
      viewerCertificate:
        props.envName === 'prod'
          ? ViewerCertificate.fromAcmCertificate(certificate, {
              aliases: [`${props.appName}.ericbach.dev`],
              securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
              sslMethod: SSLMethod.SNI,
            })
          : undefined,
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

    // S3 bucket deployment
    new BucketDeployment(this, `${props.appName}ContainerWebsiteDeployment`, {
      sources: [Source.asset('../frontend/dist')],
      destinationBucket: hostingBucket,
      retainOnDelete: false,
      contentLanguage: 'en',
      //storageClass: StorageClass.INTELLIGENT_TIERING,
      serverSideEncryption: ServerSideEncryption.AES_256,
      cacheControl: [CacheControl.setPublic(), CacheControl.maxAge(Duration.minutes(1))],
      distribution,
      distributionPaths: ['/static/css/*'],
    });
  }
}

import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import {
  CloudFrontAllowedMethods,
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol,
  SSLMethod,
  ViewerCertificate
} from 'aws-cdk-lib/aws-cloudfront';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, ServerSideEncryption, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { FrontendStackProps } from './types/StackProps';

const dotenv = require('dotenv');

dotenv.config();

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // CloudFront OAI
    const cloudfrontOAI = new OriginAccessIdentity(this, 'cloudfront-OAI', {
      comment: `OAI for ${id}`,
    });

    // S3 bucket for client app
    const hostingBucket = new Bucket(this, 'HostingBucket', {
      bucketName: `${props.appName}-hosting-bucket-${props.envName}`,
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

    // Existing ACM certificate
    const certificate = Certificate.fromCertificateArn(this, 'Certificate', props.params.certificateArn || '');

    // CloudFront distribution
    const distribution = new CloudFrontWebDistribution(this, 'WebsiteCloudFront', {
      priceClass: PriceClass.PRICE_CLASS_100,
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
            aliases: [`${props.appName}.bebi.store`],
            securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
            sslMethod: SSLMethod.SNI,
          })
          : undefined,
    });

    new BucketDeployment(this, 'WebsiteDeployment', {
      sources: [Source.asset('../frontend/build')],
      destinationBucket: hostingBucket,
      retainOnDelete: false,
      contentLanguage: 'en',
      serverSideEncryption: ServerSideEncryption.AES_256,
      cacheControl: [CacheControl.setPublic(), CacheControl.maxAge(Duration.minutes(1))],
      distribution,
      distributionPaths: ['/*'],
    });

    if (props.envName === 'prod') {
      var existingHostedZone = HostedZone.fromLookup(this, 'Zone', {
        domainName: 'bebi.store',
      });
      new ARecord(this, 'AliasRecord', {
        zone: existingHostedZone,
        recordName: `${props.appName}.bebi.store`,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      });
    }
  }
}

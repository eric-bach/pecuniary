import { Match, Template } from 'aws-cdk-lib/assertions';
import { PecuniaryFrontendStackProps } from '../lib/types/PecuniaryStackProps';
import { App } from 'aws-cdk-lib';
import { MfeStack } from '../lib/mfe-stack';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

describe('MFE Stack contains expected resources', () => {
  const app = new App();

  const props: PecuniaryFrontendStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    params: {
      certificateArn: 'arn',
    },
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  const fromCertificateArn = jest.spyOn(Certificate, 'fromCertificateArn');
  fromCertificateArn.mockReturnValue({ certificateArn: 'arn:aws:Certificate:::test' } as Certificate);

  const stack = new MfeStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('should have hosting bucket', () => {
    template.hasResourceProperties(
      'AWS::S3::Bucket',
      Match.objectLike({
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      })
    );
  });

  test('should have cloudfront distribution', () => {
    template.hasResourceProperties(
      'AWS::CloudFront::Distribution',
      Match.objectLike({
        DistributionConfig: {
          Enabled: true,
          HttpVersion: 'http2',
          DefaultRootObject: 'container/latest/index.html',
        },
      })
    );
  });
});

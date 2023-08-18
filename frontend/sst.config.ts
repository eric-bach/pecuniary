import type { SSTConfig } from 'sst';
import { RemixSite } from 'sst/constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { CERTIFICATE_ARN, HOSTED_ZONE_ID, HOSTED_ZONE_NAME } from './constants';

export default {
  config(_input) {
    return {
      name: 'pecuniary',
      region: 'us-east-1',
    };
  },

  stacks(app) {
    app.stack(
      function Site({ stack }) {
        const site = new RemixSite(stack, 'site', {
          customDomain:
            app.stage === 'prod'
              ? {
                  domainName: 'pecuniary-remix-sst.ericbach.dev',
                  cdk: {
                    certificate: Certificate.fromCertificateArn(stack, 'Certificate', CERTIFICATE_ARN),
                    // hostedZone: HostedZone.fromHostedZoneAttributes(stack, 'MyZone', {
                    //   hostedZoneId: HOSTED_ZONE_ID,
                    //   zoneName: HOSTED_ZONE_NAME,
                    // }),
                  },
                }
              : undefined,
        });

        stack.addOutputs({
          url: site.url,
        });
      },
      {
        stackName: `pecuniary-remix-sst-${app.stage}`,
      }
    );
  },
} satisfies SSTConfig;

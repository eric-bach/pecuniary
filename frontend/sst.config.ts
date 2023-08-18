import type { SSTConfig } from 'sst';
import { RemixSite } from 'sst/constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';

import { StringParameter } from 'aws-cdk-lib/aws-ssm';

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
        const certificateArn = StringParameter.fromStringParameterName(stack, '/sst/pecuniary/prod/certificateArn', 1);
        const hostedZoneId = StringParameter.fromStringParameterName(stack, '/sst/pecuniary/prod/hostedZoneId', 1);

        const site = new RemixSite(stack, 'site', {
          customDomain:
            app.stage === 'prod'
              ? {
                  domainName: 'percuiary-remix-sst.ericbach.dev',
                  cdk: {
                    certificate: Certificate.fromCertificateArn(stack, 'Certificate', certificateArn.stringValue),
                    hostedZone: HostedZone.fromHostedZoneAttributes(stack, 'MyZone', {
                      hostedZoneId: hostedZoneId.stringValue,
                      zoneName: 'ericbach.dev',
                    }),
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

import type { SSTConfig } from 'sst';
import { RemixSite } from 'sst/constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';

const fs = require('fs');

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
        // TODO Move to SSM and use AWS SDK to read from SSM
        let config;
        if (app.stage === 'prod') {
          config = JSON.parse(fs.readFileSync('prod.config'));
        }

        const site = new RemixSite(stack, 'site', {
          customDomain:
            app.stage === 'prod'
              ? {
                  domainName: `pecuniary-remix-sst.${config.hostedZoneName}`,
                  cdk: {
                    certificate: Certificate.fromCertificateArn(stack, 'Certificate', config.certificateArn),
                    hostedZone: HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
                      hostedZoneId: config.hostedZoneId,
                      zoneName: config.hostedZoneName,
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

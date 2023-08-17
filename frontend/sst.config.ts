import type { SSTConfig } from 'sst';
import { RemixSite } from 'sst/constructs';

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
        const site = new RemixSite(stack, 'site');

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

import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    'graphql/schema.graphql',
    `
      scalar AWSDate
      scalar AWSTime
      scalar AWSDateTime
      scalar AWSTimestamp
      scalar AWSEmail
      scalar AWSJSON
      scalar AWSURL
      scalar AWSPhone
      scalar AWSIPAddress
    `,
  ],
  config: {
    scalars: {
      AWSJSON: 'string',
      AWSDate: 'string',
      AWSTime: 'string',
      AWSDateTime: 'string',
      AWSTimestamp: 'number',
      AWSEmail: 'string',
      AWSURL: 'string',
      AWSPhone: 'string',
      AWSIPAddress: 'string',
    },
  },
  generates: {
    'graphql/api/codegen/appsync.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

export default config;

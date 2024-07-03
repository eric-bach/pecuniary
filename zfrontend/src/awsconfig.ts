import { ResourcesConfig } from 'aws-amplify';

export const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_API_ENDPOINT || '',
      region: process.env.NEXT_PUBLIC_APPSYNC_REGION || '',
      defaultAuthMode: 'userPool' as any,
    },
  },
};

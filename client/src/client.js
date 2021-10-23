import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';

import { ApolloLink, createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

import AppSyncConfig from './aws-exports';

const url = AppSyncConfig.aws_appsync_graphqlEndpoint;
const region = AppSyncConfig.aws_project_region;
const auth = {
  type: AppSyncConfig.aws_appsync_authenticationType,
  // TODO Get token from user session
  //      async () => token,
  jwtToken: localStorage.getItem('accessToken'),
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }, createHttpLink({ uri: url })),
]);

const client = new ApolloClient({ link, cache: new InMemoryCache() });

console.log('[CLIENT] Apollo Client initialized: ', client); // TODO TEMP

export default client;

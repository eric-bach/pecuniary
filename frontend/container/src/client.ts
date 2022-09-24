// https://github.com/awslabs/aws-mobile-appsync-sdk-js#using-authorization-and-subscription-links-with-apollo-client-v3-no-offline-support
import { createAuthLink, AUTH_TYPE, AuthOptions } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { ApolloLink, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

import { getAccessToken } from './contexts/authContext';

const url = process.env.REACT_APPSYNC_ENDPOINT || '';
const region = process.env.REACT_APPSYNC_REGION || '';

const sessionToken: any = getAccessToken();
console.log('[CLIENT] Access Token:', sessionToken);

const auth: AuthOptions = {
  type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
  jwtToken: sessionToken,
};

console.log('[CLIENT] Authorization token:', auth);

const httpLink = new HttpLink({ uri: url });

const link = ApolloLink.from([createAuthLink({ url, region, auth }), createSubscriptionHandshakeLink({ url, region, auth }, httpLink)]);

const client = new ApolloClient({ link, cache: new InMemoryCache() });

console.log('[CLIENT] Apollo Client initialized:', client);

export default client;

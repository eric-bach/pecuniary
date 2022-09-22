// https://github.com/awslabs/aws-mobile-appsync-sdk-js#using-authorization-and-subscription-links-with-apollo-client-v3-no-offline-support
import { createAuthLink, AUTH_TYPE, AuthOptions } from 'aws-appsync-auth-link';
import { useContext } from 'react';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { ApolloLink, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

//import { AuthContext } from './contexts/authContext';
//import { getCurrentUser, getSession } from './contexts/Session';
import AppSyncConfig from './aws-exports';
//import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

const url = AppSyncConfig.aws_appsync_graphqlEndpoint;
const region = AppSyncConfig.aws_project_region;

//const authContext = useContext(AuthContext);
//console.log('[CLIENT] Auth Context:', authContext);

// let currentUser: CognitoUser | null = getCurrentUser();
// console.log('[CLIENT] currentUser:', currentUser);
// const session: CognitoUserSession = getSession();
const token = localStorage.getItem('accessToken') || '';
console.log('[DASHBOARD CLIENT] token:', token);

const auth: AuthOptions = {
  type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS, // AppSyncConfig.aws_appsync_authenticationType,
  jwtToken: token,
  //jwtToken: authContext.sessionInfo?.accessToken || '',
};

console.log('[DASHBOARD CLIENT] Authorization token:', auth);

const httpLink = new HttpLink({ uri: url });

const link = ApolloLink.from([createAuthLink({ url, region, auth }), createSubscriptionHandshakeLink({ url, region, auth }, httpLink)]);

const client = new ApolloClient({ link, cache: new InMemoryCache() });

console.log('[CLIENT] Apollo Client initialized:', client);

export default client;

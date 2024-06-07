import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CognitoUser, CognitoUserPool, CognitoUserSession, AuthenticationDetails } from 'amazon-cognito-identity-js';

if (!process.env.NEXT_PUBLIC_USER_POOL_ID || !process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID) {
  throw new Error('Missing Cognito credentials. Please check your .env file.');
}

const UserPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
});

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      authorize(credentials) {
        const cognitoUser = new CognitoUser({
          Username: credentials?.email || '',
          Pool: UserPool,
        });

        const authenticationDetails = new AuthenticationDetails({
          Username: credentials?.email || '',
          Password: credentials?.password,
        });

        return new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
              if (session instanceof CognitoUserSession) {
                const userInfo = {
                  id: session.getIdToken().payload.sub,
                  email: session.getIdToken().payload.email,
                  name: session.getIdToken().payload.name,
                  idToken: session.getIdToken().getJwtToken(),
                  accessToken: session.getAccessToken().getJwtToken(),
                  refreshToken: session.getRefreshToken().getToken(),
                };

                resolve(userInfo);
              }
            },
            onFailure: (error) => {
              console.log(error);
              if (error) {
                reject(error);
              }
            },
          });
        });
      },
    }),
  ],
});

export { handler as GET, handler as POST };

import { CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
const poolData = {
  UserPoolId: process.env.REACT_APP_USERPOOL_ID || '',
  ClientId: process.env.REACT_APP_CLIENT_ID || '',
};

const userPool: CognitoUserPool = new CognitoUserPool(poolData);

import * as cognito from '../libs/cognito';

export const getAccessToken = async () => {
  var session: any = await new Promise((resolve, reject) => {
    const user = cognito.getCurrentUser();

    if (user) {
      user.getSession((err: any, session: any) => {
        if (!err) {
          resolve(session);
        }
      });
    }
  });

  return session.accessToken.jwtToken;
};

export async function getSession() {
  const currentUser: CognitoUser | null = userPool.getCurrentUser();

  return new Promise(function (resolve, reject) {
    if (!currentUser) {
      throw 'No current user';
    }

    currentUser.getSession(function (err: any, session: any) {
      if (err) {
        reject(err);
      } else {
        resolve(session);
      }
    });
  }).catch((err) => {
    throw err;
  });
}

const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

export { getCurrentUser };

// import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
// import Pool from './UserPool';

// const isUserLoggedIn = async () => {
//   const accessToken = await getAccessToken();

//   return accessToken;
// };

// const getAccessToken: () => Promise<string> = async (): Promise<string> => {
//   var session: CognitoUserSession | null = await new Promise((resolve, reject) => {
//     const user: CognitoUser | null = Pool.getCurrentUser();

//     if (user) {
//       user.getSession((err: Error, session: CognitoUserSession | null) => {
//         if (!err) {
//           resolve(session);
//         }
//       });
//     }
//   });

//   return session?.accessToken.jwtToken;
// };

// export { isUserLoggedIn, getAccessToken };

import { createContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

import Pool from '../../UserPool';

const UserContext = createContext<any>([[], () => null]);

const User = (props: any) => {
  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();

      if (user) {
        user.getSession((err: any, session: any) => {
          if (!err) {
            resolve(session);
          }
        });
      }

      /*
      if (user) {
        user.getSession((err: any, session: any) => {
          if (err) {
            reject();
          } else {
            resolve(session);
          }
        });
      } else {
        reject();
      }
      */
    });
  };

  const authenticate = async (Username: string, Password: string) => {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });

      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log('[USER] Authentication succeeded: ', data);

          // TODO Change to check if user is authenticated from session instead of localStorage
          localStorage.setItem('isAuthenticated', 'true');

          resolve(data);
        },
        onFailure: (err) => {
          console.error('[USER] Authentication failed: ', err);

          reject(err);
        },
        newPasswordRequired: (data) => {
          console.log('[USER] New Password Required: ', data);

          resolve(data);

          // TODO Redirect to password change page
        },
      });
    });
  };

  const logout = () => {
    // Clear localStorage
    localStorage.clear();

    const user = Pool.getCurrentUser();

    if (user) {
      user.signOut();
    }

    // Redirect back to home page
    window.location.pathname = '/login';
  };

  return <UserContext.Provider value={{ authenticate, getSession, logout }}>{props.children}</UserContext.Provider>;
};

export { User, UserContext };

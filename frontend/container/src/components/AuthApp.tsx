import { mount } from 'auth/AuthApp';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../contexts/authContext';

export enum AuthStatus {
  SignedIn,
  VerificationRequired,
  AccountCreated,
  SignedOut,
}

export default ({ onSignIn, onSignUp }: any) => {
  const ref = useRef(null);
  const history = useHistory();

  const authContext = useContext(AuthContext);

  const signInWithEmail = async (user: string, password: string): Promise<AuthStatus> => {
    try {
      console.log('ATTEMPTING TO SIGN IN: ', user, password, authContext);
      await authContext.signInWithEmail(user, password);
      return AuthStatus.SignedIn;
    } catch (err: any) {
      if (err.code === 'UserNotConfirmedException') {
        return AuthStatus.VerificationRequired;
        //history.push('verify');
      } else {
        console.error(err);
        return AuthStatus.SignedOut;
      }
    }
  };

  const signUpWithEmail = async (user: string, password: string) => {
    try {
      console.log('ATTEMPTING TO SIGN UP: ', user, password, authContext);
      await authContext.signUpWithEmail(user, user, password);
      return AuthStatus.AccountCreated;
    } catch (err: any) {
      return AuthStatus.SignedOut;
    }
  };

  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      initialPath: history.location.pathname,

      // Callback to update BrowserHistory when Auth app navigates
      onNavigate: ({ pathname: nextPathname }: { pathname: string }) => {
        const { pathname } = history.location;

        if (pathname !== nextPathname) {
          history.push(nextPathname);
        }
      },

      // Callback for Auth SignIn button
      onSignIn: async (user: string, password: string) => {
        const signedInStatus = await signInWithEmail(user, password);

        onSignIn(signedInStatus);
      },

      onSignUp: async (user: string, password: string) => {
        const signUpStatus = await signUpWithEmail(user, password);

        onSignUp(signUpStatus);
      },
    });

    // Update Marketing app when Container app navigates
    history.listen(onParentNavigate);
  }, []);

  return <div ref={ref} />;
};

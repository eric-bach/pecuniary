import { mount } from 'auth/AuthApp';
import React, { useRef, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../contexts/authContext';

export enum SignedInStatus {
  SignedIn,
  VerificationRequired,
  SignedOut,
}

export default ({ onSignIn, onSignUp }: any) => {
  const ref = useRef(null);
  const history = useHistory();

  const authContext = useContext(AuthContext);

  const signInWithEmail = async (user: string, password: string): Promise<SignedInStatus> => {
    try {
      console.log('ATTEMPTING TO SIGN IN: ', user, password, authContext);
      await authContext.signInWithEmail(user, password);
      return SignedInStatus.SignedIn;
    } catch (err: any) {
      if (err.code === 'UserNotConfirmedException') {
        return SignedInStatus.VerificationRequired;
        //history.push('verify');
      } else {
        console.error(err);
        return SignedInStatus.SignedOut;
      }
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
        const signedIn = await signInWithEmail(user, password);

        onSignIn(signedIn);
      },

      onSignUp: (user: string, password: string) => {
        onSignUp(user, password);
      },
    });

    // Update Marketing app when Container app navigates
    history.listen(onParentNavigate);
  }, []);

  return <div ref={ref} />;
};

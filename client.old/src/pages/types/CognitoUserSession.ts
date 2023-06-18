export type CognitoUserSession = {
  idToken: {
    payload: {
      email: string;
    };
  };
};

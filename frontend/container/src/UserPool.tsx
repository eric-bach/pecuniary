import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USERPOOL_ID || 'REPLACE_ME',
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || 'REPLACE_ME',
};

export default new CognitoUserPool(poolData);

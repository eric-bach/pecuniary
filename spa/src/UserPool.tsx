import { CognitoUserPool } from 'amazon-cognito-identity-js';

const dotenv = require('dotenv');
dotenv.config();

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || 'REPLACE_ME',
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || 'REPLACE_ME',
};

export default new CognitoUserPool(poolData);

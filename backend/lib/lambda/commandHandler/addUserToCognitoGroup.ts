import * as AWS from 'aws-sdk';

import Cognito from './types/Cognito';

async function addUserToCognitoGroup(cognito: Cognito): Promise<{
  $response: AWS.Response<Record<string, string>, AWS.AWSError>;
}> {
  console.log('Received Cognito event: ', cognito);

  const params = {
    GroupName: cognito.groupName,
    UserPoolId: cognito.userPoolId,
    Username: cognito.username,
  };

  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
  var result = cognitoIdp.adminAddUserToGroup(params).promise();

  console.log(`✅ Successfully added user ${cognito.username} to cognito group ${cognito.groupName}`);

  return result;
}

export default addUserToCognitoGroup;

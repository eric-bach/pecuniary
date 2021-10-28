import { Callback, Context, PostConfirmationTriggerEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

exports.handler = async (event: PostConfirmationTriggerEvent, _context: Context, callback: Callback): Promise<void> => {
  const { userPoolId, userName } = event;

  await adminAddUserToGroup({
    userPoolId,
    username: userName,
    groupName: 'Users',
  });

  return callback(null, event);

  // TODO Use a try-catch instead (doesn't build)
  /*
  try {
    await adminAddUserToGroup({
      userPoolId,
      username: userName,
      groupName: 'Users',
    });

    return callback(null, event);
  } catch (error: any) {
    return callback(error, event);
  }
  */
};

export function adminAddUserToGroup({
  userPoolId,
  username,
  groupName,
}: {
  userPoolId: string;
  username: string;
  groupName: string;
}): Promise<{
  $response: AWS.Response<Record<string, string>, AWS.AWSError>;
}> {
  const params = {
    GroupName: groupName,
    UserPoolId: userPoolId,
    Username: username,
  };

  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
  return cognitoIdp.adminAddUserToGroup(params).promise();
}

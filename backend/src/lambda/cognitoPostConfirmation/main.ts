import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminAddUserToGroupCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Handler, PostConfirmationTriggerEvent, Context, Callback } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import middy from '@middy/core';

const logger = new Logger({ serviceName: 'cognitoPostConfirmation' });

const lambdaHandler: Handler = async (event: PostConfirmationTriggerEvent, _context: Context, callback: Callback): Promise<void> => {
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

export async function adminAddUserToGroup({
  userPoolId,
  username,
  groupName,
}: {
  userPoolId: string;
  username: string;
  groupName: string;
}) {
  const client = new CognitoIdentityProviderClient();

  const params: AdminAddUserToGroupCommandInput = {
    GroupName: groupName,
    UserPoolId: userPoolId,
    Username: username,
  };

  const command = new AdminAddUserToGroupCommand(params);
  return await client.send(command);
}

export const handler = middy(lambdaHandler).use(injectLambdaContext(logger));

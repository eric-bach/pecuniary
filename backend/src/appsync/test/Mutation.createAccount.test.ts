import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { readFile } from 'fs/promises';
import { fromTemporaryCredentials, fromSSO } from '@aws-sdk/credential-providers';
import dotenv from 'dotenv';
dotenv.config();

const file = './src/appsync/build/Mutation.createAccount.js';

if (!process.env.AWS_SERVICE_ROLE_ARN) {
  throw new Error('AWS_SERVICE_ROLE_ARN environment variable is required');
}

const appsync = new AppSyncClient({
  region: 'us-east-1',
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: process.env.AWS_SERVICE_ROLE_ARN,
      RoleSessionName: 'AppSyncTestSession',
    },
  }),
});

describe('createAccount', () => {
  it('creates a new account', async () => {
    // Arrange
    const context = {
      // AppSync transforms arguments to args - https://docs.aws.amazon.com/appsync/latest/devguide/test-debug-resolvers-js.html
      arguments: {
        input: {
          name: 'Test',
          type: 'TFSA',
          category: 'Investment',
        },
      },
      identity: {
        sub: 'uuid',
        issuer: ' https://cognito-idp.us-east-1.amazonaws.com/userPoolId',
        username: 'testuser',
        claims: {},
        sourceIp: ['x.x.x.x'],
        defaultAuthStrategy: 'ALLOW',
      },
    };
    const input: EvaluateCodeCommandInput = {
      runtime: { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' },
      code: await readFile(file, { encoding: 'utf8' }),
      context: JSON.stringify(context),
      function: 'request',
    };
    const evaluateCodeCommand = new EvaluateCodeCommand(input);

    // Act
    const response = await appsync.send(evaluateCodeCommand);

    // Assert
    expect(response).toBeDefined();
    expect(response.error).toBeUndefined();
    expect(response.evaluationResult).toBeDefined();

    const result = JSON.parse(response.evaluationResult ?? '{}');
    expect(result.operation).toEqual('PutItem');

    /* result:
    {
        operation: 'PutItem',
        key: { pk: { S: 'acc#ae9e1f98-74cc-47eb-88f9-5336ef17f2c7' } },
        attributeValues: {
          entity: { S: 'account' },
          accountId: { S: 'ae9e1f98-74cc-47eb-88f9-5336ef17f2c7' },
          category: { S: 'Investment' },
          type: { S: 'TFSA' },
          name: { S: 'Test' },
          userId: { S: 'testuser' },
          createdAt: { S: '2024-12-16T22:18:11.053Z' },
          updatedAt: { S: '2024-12-16T22:18:11.053Z' }
        }
      }
    */

    const key = unmarshall(result.key);
    const attributeValues = unmarshall(result.attributeValues);
    expect(key.pk).toEqual(`acc#${attributeValues['accountId']}`);
    expect(attributeValues['entity']).toBe('account');
    expect(attributeValues['accountId']).toBeDefined();
    expect(attributeValues['category']).toBe(context.arguments.input.category);
    expect(attributeValues['name']).toBe(context.arguments.input.name);
    expect(attributeValues['type']).toBe(context.arguments.input.type);
    expect(attributeValues['userId']).toBe(context.identity.username);
    expect(attributeValues['createdAt']).toBeDefined();
    expect(attributeValues['updatedAt']).toBeDefined();
  });
});

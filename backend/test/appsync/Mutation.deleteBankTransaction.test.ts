import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { readFile } from 'fs/promises';

const file = './src/appsync/build/Mutation.deleteBankTransaction.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Mutation.deleteBankTransaction', () => {
  it('deletes a single bank transaction', async () => {
    // Arrange
    const context = {
      arguments: {
        input: {
          pk: 'pk',
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
    expect(result.operation).toEqual('DeleteItem');

    const pk = unmarshall(result.key);
    expect(pk).toBe(pk);
  });
});

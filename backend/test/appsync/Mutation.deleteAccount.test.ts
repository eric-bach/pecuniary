import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { readFile } from 'fs/promises';

const file = './src/appsync/build/Mutation.deleteAccount.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Mutation.deleteAccount', () => {
  it('deletes a single account', async () => {
    // Arrange
    const context = {
      // AppSync transforms arguments to args - https://docs.aws.amazon.com/appsync/latest/devguide/test-debug-resolvers-js.html
      env: {
        TABLE_NAME: 'table-name',
      },
      prev: {
        result: {
          items: [
            {
              pk: 'pk',
            },
          ],
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
    expect(result.operation).toEqual('BatchDeleteItem');

    const pk = unmarshall(result.tables['table-name'][0]);
    expect(pk).toBe(pk);
  });

  it('deletes multiple items', async () => {
    // Arrange
    const context = {
      // AppSync transforms arguments to args - https://docs.aws.amazon.com/appsync/latest/devguide/test-debug-resolvers-js.html
      env: {
        TABLE_NAME: 'table-name',
      },
      prev: {
        result: {
          items: [
            {
              pk: 'pk1',
            },
            {
              pk: 'pk2',
            },
            {
              pk: 'pk3',
            },
          ],
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
    expect(result.operation).toEqual('BatchDeleteItem');

    const items = result.tables['table-name'];
    expect(items).toHaveLength(context.prev.result.items.length);
    const unmarshallItems = items.map((item: any) => unmarshall(item));
    unmarshallItems.forEach((item: string) => {
      expect(item).toBe(item);
    });
  });
});

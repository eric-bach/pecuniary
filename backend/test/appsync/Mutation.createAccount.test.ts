import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { readFile } from 'fs/promises';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const file = './src/appsync/build/Mutation.createAccount.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Mutation.createAccoujt', () => {
  it('creates a new investment account', async () => {
    // Arrange
    const context = {
      arguments: {
        input: {
          name: 'Test Account',
          category: 'investment',
          type: 'TFSA',
        },
      },
      identity: {
        username: 'testuser',
        sub: 'uuid',
        sourceIp: ['0.0.0.0'],
        defaultAuthStrategy: 'ALLOW',
        groups: null,
        issuer: 'test-issuer',
        claims: {},
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

    const key = unmarshall(result.key);
    const attributeValues = unmarshall(result.attributeValues);
    expect(key.pk).toContain('acc#');
    expect(attributeValues['entity']).toBe('account');
    expect(attributeValues['name']).toBe(context.arguments.input.name);
    expect(attributeValues['category']).toBe(context.arguments.input.category);
    expect(attributeValues['type']).toBe(context.arguments.input.type);
    expect(attributeValues['userId']).toBe(context.identity.username);
    expect(attributeValues['createdAt']).toBeDefined();
    expect(attributeValues['updatedAt']).toBeDefined();
  });
});

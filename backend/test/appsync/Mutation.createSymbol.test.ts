import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { readFile } from 'fs/promises';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const file = '../backend/appsync/build/Mutation.createSymbol.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Mutation.createSymbol', () => {
  it('creates a new symbol', async () => {
    // Arrange
    const context = {
      arguments: {
        name: 'Test Symbol',
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
    expect(key.pk).toBe(`symb#${context.arguments.name}`);
    expect(attributeValues['entity']).toBe('symbol');
    expect(attributeValues['name']).toBe(context.arguments.name);
    expect(attributeValues['userId']).toBe(context.identity.username);
    expect(attributeValues['createdAt']).toBeDefined();
    expect(attributeValues['updatedAt']).toBeDefined();
  });
});

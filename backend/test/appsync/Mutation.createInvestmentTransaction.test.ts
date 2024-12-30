import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { readFile } from 'fs/promises';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const file = './src/appsync/build/Mutation.createInvestmentTransaction.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Mutation.createInvestmentTransaction', () => {
  it('creates a new investment transaction', async () => {
    // Arrange
    const context = {
      arguments: {
        input: {
          accountId: '123',
          commission: 10.0,
          price: 180.27,
          shares: 100,
          symbol: 'AMZN',
          type: 'Buy',
          transactionDate: new Date().setHours(0, 0, 0, 0),
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
    expect(key.pk).toContain('trans#');
    expect(attributeValues['accountId']).toBe(context.arguments.input.accountId);
    expect(attributeValues['transactionId']).toBeDefined();
    expect(attributeValues['transactionDate']).toBe(context.arguments.input.transactionDate);
    expect(attributeValues['type']).toBe(context.arguments.input.type);
    expect(attributeValues['symbol']).toBe(context.arguments.input.symbol);
    expect(attributeValues['shares']).toBe(context.arguments.input.shares);
    expect(attributeValues['price']).toBe(context.arguments.input.price);
    expect(attributeValues['commission']).toBe(context.arguments.input.commission);
    expect(attributeValues['userId']).toBe(context.identity.username);
    expect(attributeValues['createdAt']).toBeDefined();
    expect(attributeValues['updatedAt']).toBeDefined();
  });
});

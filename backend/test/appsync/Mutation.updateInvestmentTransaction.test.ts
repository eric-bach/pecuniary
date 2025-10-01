import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { readFile } from 'fs/promises';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const file = '../backend/appsync/build/Mutation.updateInvestmentTransaction.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Mutation.updateInvestmentTransaction', () => {
  it('updates an existing investment transaction', async () => {
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
          transactionId: '456',
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
    expect(result.operation).toEqual('UpdateItem');

    const key = unmarshall(result.key);
    const expressionValues = unmarshall(result.update.expressionValues);
    expect(key.pk).toContain('trans#');
    expect(expressionValues['accountId']).toBe(context.arguments.input.accountId);
    expect(expressionValues['type']).toBe(context.arguments.input.type);
    expect(expressionValues['symbol']).toBe(context.arguments.input.symbol);
    expect(expressionValues['shares']).toBe(context.arguments.input.shares);
    expect(expressionValues['price']).toBe(context.arguments.input.price);
    expect(expressionValues['commission']).toBe(context.arguments.input.commission);
    expect(expressionValues['userId']).toBe(context.identity.username);
    expect(expressionValues['updatedAt']).toBeDefined();
  });
});

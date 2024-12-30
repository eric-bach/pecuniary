import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { readFile } from 'fs/promises';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const file = './src/appsync/build/Mutation.updateBankTransaction.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Mutation.updateBankTransaction', () => {
  it('updates an existing bank transaction', async () => {
    // Arrange
    const context = {
      arguments: {
        input: {
          accountId: '123',
          amount: 100.0,
          category: 'Housing',
          payee: 'Amazon',
          transactionDate: new Date().setHours(0, 0, 0, 0),
          transasctionId: '456',
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
    expect(expressionValues['transactionDate']).toBe(context.arguments.input.transactionDate);
    expect(expressionValues['payee']).toBe(context.arguments.input.payee);
    expect(expressionValues['category']).toBe(context.arguments.input.category);
    expect(expressionValues['amount']).toBe(context.arguments.input.amount);
    expect(expressionValues['userId']).toBe(context.identity.username);
    expect(expressionValues['updatedAt']).toBeDefined();
  });
});

import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { readFile } from 'fs/promises';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const file = '../backend/appsync/build/Mutation.createBankTransaction.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Mutation.createBankTransaction', () => {
  it('creates a new bank transaction', async () => {
    // Arrange
    const context = {
      arguments: {
        input: {
          accountId: '123',
          amount: 100.0,
          category: 'Housing',
          payee: 'Amazon',
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
    expect(attributeValues['entity']).toBe('bank-transaction');
    expect(attributeValues['accountId']).toBe(context.arguments.input.accountId);
    expect(attributeValues['transactionId']).toBeDefined();
    expect(attributeValues['payee']).toBe(context.arguments.input.payee);
    expect(attributeValues['category']).toBe(context.arguments.input.category);
    expect(attributeValues['amount']).toBe(context.arguments.input.amount);
    expect(attributeValues['userId']).toBe(context.identity.username);
    expect(attributeValues['createdAt']).toBeDefined();
    expect(attributeValues['updatedAt']).toBeDefined();
  });
});

import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { readFile } from 'fs/promises';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const file = './src/appsync/build/Query.getPayees.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Query.getPayees', () => {
  it('returns all payees', async () => {
    // Arrange
    const context = {
      arguments: {
        lastEvaluatedKey: null,
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
    expect(result.operation).toEqual('Query');

    expect(result.query.expression).toEqual('userId = :userId');
    const queryExpressionValues = unmarshall(result.query.expressionValues);
    expect(queryExpressionValues[':userId']).toEqual(context.identity.username);

    expect(result.filter.expression).toEqual('entity = :entity');
    const filterExpressionValues = unmarshall(result.filter.expressionValues);
    expect(filterExpressionValues[':entity']).toEqual('payee');
  });
});

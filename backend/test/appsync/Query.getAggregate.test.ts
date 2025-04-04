import { AppSyncClient, EvaluateCodeCommand, EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { readFile } from 'fs/promises';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const file = './src/appsync/build/Query.getAggregate.js';

const appsync = new AppSyncClient({ region: 'us-east-1' });

describe('Query.getAggregate', () => {
  it('returns all aggregates', async () => {
    // Arrange
    const context = {
      arguments: {
        accountId: '123',
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

    expect(result.query.expression).toEqual('accountId = :accountId');
    const queryExpressionValues = unmarshall(result.query.expressionValues);
    expect(queryExpressionValues[':accountId']).toEqual(context.arguments.accountId);

    expect(result.filter.expression).toEqual('userId = :userId');
    const filterExpressionValues = unmarshall(result.filter.expressionValues);
    expect(filterExpressionValues[':userId']).toEqual(context.identity.username);
  });

  // TODO: this may not be a use case anymore?
  it('returns all aggregates with type', async () => {
    // Arrange
    const context = {
      arguments: {
        accountId: '123',
        type: 'TFSA',
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

    expect(result.query.expression).toEqual('accountId = :accountId');
    const queryExpressionValues = unmarshall(result.query.expressionValues);
    expect(queryExpressionValues[':accountId']).toEqual(context.arguments.accountId);

    expect(result.filter.expression).toEqual('userId = :userId AND #type = :type');
    const filterExpressionValues = unmarshall(result.filter.expressionValues);
    expect(filterExpressionValues[':userId']).toEqual(context.identity.username);
    expect(filterExpressionValues[':type']).toEqual(context.arguments.type);
  });
});

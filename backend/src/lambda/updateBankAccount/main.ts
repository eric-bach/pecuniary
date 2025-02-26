import { EventBridgeEvent } from 'aws-lambda';
import { UpdateItemCommandInput, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import dynamoDbCommand from '../../utils/dynamoDbClient';
import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import middy from '@middy/core';
import { BankTransaction } from '../../appsync/api/codegen/appsync';

const logger = new Logger({ serviceName: 'updateBankAccount' });

const lambdaHandler = async (event: EventBridgeEvent<string, BankTransaction>): Promise<UpdateItemCommandInput> => {
  const data = parseEvent(event);

  logger.debug('🔔 Received event', { data: data });

  if (!data || !data.accountId || !data.amount) {
    throw new Error(`🛑 No data found in event ${data}`);
  }

  // update dynamodb account
  const input: UpdateItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({ pk: `acc#${data.accountId}` }),
    UpdateExpression: 'SET balance = balance + :amount, updatedAt = :updatedAt',
    ExpressionAttributeValues: marshall({
      ':amount': data.amount,
      ':updatedAt': new Date().toISOString(),
    }),
    ReturnValues: 'UPDATED_NEW',
  };

  logger.debug('Updating bank account', { data: input });

  const result = await dynamoDbCommand(new UpdateItemCommand(input));

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`🛑 Could not update bank account ${data.accountId}`);
  }

  logger.info(`✅ Updated bank account ${data.accountId}`);

  return input;
};

function parseEvent(event: EventBridgeEvent<string, BankTransaction>): BankTransaction {
  const eventString: string = JSON.stringify(event);

  logger.debug('Parsing event', { data: eventString });

  return JSON.parse(eventString).detail;
}

export const handler = middy(lambdaHandler).use(injectLambdaContext(logger));

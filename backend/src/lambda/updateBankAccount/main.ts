import { EventBridgeEvent } from 'aws-lambda';
import { UpdateItemCommandInput, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import dynamoDbCommand from '../../utils/dynamoDbClient';
import { BankTransaction } from '../../appsync/api/codegen/appsync';

const handler = async (event: EventBridgeEvent<string, BankTransaction>): Promise<UpdateItemCommandInput> => {
  const data = parseEvent(event);

  console.log(`🔔 Received event: ${JSON.stringify(data)}`);

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
  const result = await dynamoDbCommand(new UpdateItemCommand(input));

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`🛑 Could not update bank account ${data.accountId}`);
  }

  return input;
};

function parseEvent(event: EventBridgeEvent<string, BankTransaction>): BankTransaction {
  const eventString: string = JSON.stringify(event);

  console.debug(`🕧 Received event: ${eventString}`);

  return JSON.parse(eventString).detail;
}

module.exports = { handler };

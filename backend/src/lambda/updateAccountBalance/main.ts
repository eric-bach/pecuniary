import { EventBridgeEvent } from 'aws-lambda';
import { UpdateItemCommandInput, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import dynamoDbCommand from './utils/dynamoDbClient';

type EventData = {
  accountId: string;
  amount: number;
};

const handler = async (event: EventBridgeEvent<string, EventData>) => {
  const data = parseEvent(event);

  console.log(`🔔 Received event: ${JSON.stringify(data)}`);

  if (!data || !data.accountId || !data.amount) {
    throw new Error(`🛑 No data found in event ${data}`);
  }

  // update dynamodb account
  const params: UpdateItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({ pk: `acc#${data.accountId}` }),
    UpdateExpression: 'SET balance = balance + :amount, updatedAt = :updatedAt',
    ExpressionAttributeValues: marshall({
      ':amount': data.amount,
      ':updatedAt': new Date().toISOString(),
    }),
    ReturnValues: 'UPDATED_NEW',
  };
  const result = await dynamoDbCommand(new UpdateItemCommand(params));

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`🛑 Could not update account ${data.accountId}`);
  }
};

function parseEvent(event: EventBridgeEvent<string, EventData>): EventData {
  const eventString: string = JSON.stringify(event);

  console.debug(`🕧 Received event: ${eventString}`);

  return JSON.parse(eventString).detail;
}

module.exports = { handler };

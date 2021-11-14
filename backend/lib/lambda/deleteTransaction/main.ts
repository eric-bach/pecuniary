import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall } = require('@aws-sdk/util-dynamodb');

type Detail = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
};
type Transaction = {
  id: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  accountId: number;
};

exports.handler = async (event: EventBridgeEvent<string, Transaction>) => {
  var eventString = JSON.stringify(event);
  console.debug(`Received event: ${eventString}`);

  var detail = JSON.parse(eventString).detail;
  var data = JSON.parse(detail.data);

  // Delete Transactions
  await deleteTransactionsAsync(data);

  // Publish event to update positions
  await publishEventAsync(detail, event);
};

async function deleteTransactionsAsync(data: Transaction) {
  console.log(`🔔 Deleting Positions in Account: ${data.id}`);

  const input = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    Key: marshall({
      id: data.id,
    }),
  };

  console.log(`Deleting Transaction: ${data.id}`);
  await dynamoDbCommand(new DeleteItemCommand(input));
  console.log('✅ Deleted Transaction');
}

async function publishEventAsync(detail: Detail, event: EventBridgeEvent<string, Transaction>) {
  var params = {
    Entries: [
      {
        Source: event.source,
        EventBusName: process.env.EVENTBUS_PECUNIARY_NAME,
        DetailType: 'TransactionSavedEvent', // TODO have to hard-code because we cannot access event.detailtype to modify it
        Detail: JSON.stringify(detail),
      },
    ],
  };
  console.debug(`EventBridge event: ${JSON.stringify(params)}`);

  const client = new EventBridgeClient();
  var command = new PutEventsCommand(params);

  var result;
  try {
    console.log(`🔔 Sending ${params.Entries.length} event(s) to EventBridge`);
    result = await client.send(command);
  } catch (error) {
    console.error(error);
  } finally {
    console.log(`✅ Successfully sent ${params.Entries.length} event(s) to EventBridge: ${JSON.stringify(result)}`);
  }
}

async function dynamoDbCommand(command: typeof DeleteItemCommand) {
  var result;

  try {
    var client = new DynamoDBClient({ region: process.env.REGION });
    console.debug(`DynamoDB command:\n${JSON.stringify(command)}`);
    result = await client.send(command);
    console.log(`DynamoDB result:\n${JSON.stringify(result)}`);
  } catch (error) {
    console.error(`❌ Error with DynamoDB command:\n`, error);
  }

  return result;
}

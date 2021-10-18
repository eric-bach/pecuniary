import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

type Detail = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
};
type Account = {
  id: string;
  name: string;
  description: string;
  bookValue: number;
  marketValue: number;
};

exports.handler = async (event: EventBridgeEvent<string, Account>) => {
  var eventString = JSON.stringify(event);
  console.debug(`EventBridge event: ${eventString}`);

  var detail = JSON.parse(eventString).detail;
  var data = JSON.parse(detail.data);

  // Delete all positions
  await deletePositionsAsync(detail, data);

  // Delete all transactions
  await deleteTransactionsAsync(detail, data);

  // Delete Account
  await deleteAccountAsync(data);
};

async function deletePositionsAsync(detail: Detail, data: Account) {
  console.log(`Deleting Positions in Account: ${data.id}`);

  // Get all positions
  const input = {
    TableName: process.env.POSITION_TABLE_NAME,
    ExpressionAttributeValues: {
      ':u': { S: detail.userId },
      ':a': { S: data.id },
    },
    FilterExpression: 'positionReadModelAccountId = :a AND userId = :u',
  };
  var result = await dynamoDbCommand(new ScanCommand(input));

  if (result && result.Items) {
    console.log(`Found ${result.Count} position(s) in Account`);

    // Delete all positions
    // TODO change the type of p
    result.Items.forEach(async (p: Account) => {
      const deleteInput = {
        TableName: process.env.POSITION_TABLE_NAME,
        Key: {
          id: p.id,
        },
      };

      await dynamoDbCommand(new DeleteItemCommand(deleteInput));
    });

    console.log(`🔔 Deleted ${result.Count} position(s) in account`);
  } else {
    console.log(`🔔 No positions found in account`);
  }
}

async function deleteTransactionsAsync(detail: Detail, data: Account) {
  console.log(`Deleting Transactions in Account: ${data.id}`);

  // Get all transactions
  const input = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    ExpressionAttributeValues: {
      ':u': { S: detail.userId },
      ':t': { S: data.id },
    },
    FilterExpression: 'transactionReadModelAccountId = :t AND userId = :u',
  };
  var result = await dynamoDbCommand(new ScanCommand(input));

  if (result && result.Items) {
    console.log(`Found ${result.Count} transactions(s) in Account`);

    // Delete all transactions
    // TODO change the type of p
    result.Items.forEach(async (p: Account) => {
      const deleteInput = {
        TableName: process.env.TRANSACTION_TABLE_NAME,
        Key: {
          id: p.id,
        },
      };

      await dynamoDbCommand(new DeleteItemCommand(deleteInput));
    });

    console.log(`🔔 Deleted ${result.Count} transactions(s) in account`);
  } else {
    console.log(`🔔 No transactions found in account`);
  }
}

async function deleteAccountAsync(data: Account) {
  const input = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Key: marshall({
      id: data.id,
    }),
  };

  console.log(`🔔 Deleting Account: ${data.id}`);
  await dynamoDbCommand(new DeleteItemCommand(input));
  console.log('✅ Deleted Account');
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

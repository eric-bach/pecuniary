import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

import { EventBridgeDetail, DeleteAccountData, Aggregate } from './types/account';

exports.handler = async (event: EventBridgeEvent<string, DeleteAccountData>) => {
  const eventString: string = JSON.stringify(event);
  console.debug(`EventBridge event: ${eventString}`);

  const detail: EventBridgeDetail = JSON.parse(eventString).detail;
  const data: DeleteAccountData = JSON.parse(detail.data);

  // Delete all positions
  await deletePositionsAsync(detail, data);

  // Delete all transactions
  await deleteTransactionsAsync(detail, data);

  // Delete Account
  await deleteAccountAsync(data);
};

async function deletePositionsAsync(detail: EventBridgeDetail, data: DeleteAccountData) {
  console.log(`Deleting Positions in Account: ${data.id}`);

  // Get all positions
  const input = {
    TableName: process.env.POSITION_TABLE_NAME,
    ExpressionAttributeValues: {
      ':u': { S: detail.userId },
      ':a': { S: data.id },
    },
    FilterExpression: 'accountId = :a AND userId = :u',
  };
  var result = await dynamoDbCommand(new ScanCommand(input));

  if (result && result.Items) {
    console.log(`Found ${result.Count} position(s) in Account`);

    // Delete all positions
    result.Items.forEach(async (p: Aggregate) => {
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

async function deleteTransactionsAsync(detail: EventBridgeDetail, data: DeleteAccountData) {
  console.log(`Deleting Transactions in Account: ${data.id}`);

  // Get all transactions
  const input = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    ExpressionAttributeValues: {
      ':u': { S: detail.userId },
      ':t': { S: data.id },
    },
    FilterExpression: 'accountId = :t AND userId = :u',
  };
  var result = await dynamoDbCommand(new ScanCommand(input));

  if (result && result.Items) {
    console.log(`Found ${result.Count} transactions(s) in Account`);

    // Delete all transactions
    result.Items.forEach(async (p: Aggregate) => {
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

async function deleteAccountAsync(data: DeleteAccountData) {
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

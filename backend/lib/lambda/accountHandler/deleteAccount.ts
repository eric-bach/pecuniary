const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

import { DeleteAccountInput } from '../types/Account';
import { Aggregate } from '../types/Event';

async function deleteAccount(input: DeleteAccountInput) {
  // Delete all positions
  await deletePositionsAsync(input);

  // Delete all transactions
  await deleteTransactionsAsync(input);

  // Delete Account
  await deleteAccountAsync(input);
}

async function deletePositionsAsync(input: DeleteAccountInput) {
  console.log(`Deleting Positions in Account: ${input.id}`);

  // Get all positions
  const posInput = {
    TableName: process.env.POSITION_TABLE_NAME,
    ExpressionAttributeValues: {
      ':u': { S: input.userId },
      ':a': { S: input.id },
    },
    FilterExpression: 'accountId = :a AND userId = :u',
  };
  var result = await dynamoDbCommand(new ScanCommand(posInput));

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

async function deleteTransactionsAsync(input: DeleteAccountInput) {
  console.log(`Deleting Transactions in Account: ${input.id}`);

  // Get all transactions
  const transInput = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    ExpressionAttributeValues: {
      ':u': { S: input.userId },
      ':t': { S: input.id },
    },
    FilterExpression: 'accountId = :t AND userId = :u',
  };
  var result = await dynamoDbCommand(new ScanCommand(transInput));

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

async function deleteAccountAsync(input: DeleteAccountInput) {
  const accInput = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Key: marshall({
      id: input.id,
    }),
  };

  console.log(`🔔 Deleting Account: ${input.id}`);
  await dynamoDbCommand(new DeleteItemCommand(accInput));
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

export default deleteAccount;

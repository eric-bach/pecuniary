import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, UpdateItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
import { ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

import { AccountData, AccountReadModel } from '../types/Account';
import { PositionReadModel } from '../types/Position';

exports.handler = async (event: EventBridgeEvent<string, AccountData>) => {
  const eventString: string = JSON.stringify(event);
  console.debug(`Received event: ${eventString}`);

  const detail: AccountData = JSON.parse(eventString).detail;

  // Get account matching account id
  var account: AccountReadModel = await getAccountAsync(detail.id);

  // Get all positions matching account id
  var positions: [PositionReadModel] = await getPositionsAsync(account.aggregateId);

  // Update Account values
  await updateAccountValuesAsync(account, positions);
};

async function getAccountAsync(id: string): Promise<AccountReadModel> {
  const params = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Key: marshall({ id: id }),
  };

  try {
    console.debug('Looking up Account: ', id);

    const client = new DynamoDBClient({});
    const result = await client.send(new GetItemCommand(params));

    if (result.Item) {
      return unmarshall(result.Item);
    } else {
      console.log(`🔔 Could not find Account with matching Id: ${id}`);
    }
  } catch (e) {
    console.log(`❌ Error looking for Account: ${e}`);
  }

  return {} as AccountReadModel;
}

async function getPositionsAsync(aggregateId: string): Promise<[PositionReadModel]> {
  const params: ScanCommandInput = {
    TableName: process.env.POSITION_TABLE_NAME,
    ExpressionAttributeNames: {
      '#a': 'aggregateId',
    },
    ExpressionAttributeValues: {
      ':aggregateId': { S: aggregateId },
    },
    FilterExpression: '#a = :aggregateId',
  };

  try {
    console.debug('Searching for Positions');

    const client = new DynamoDBClient({});
    const result = await client.send(new ScanCommand(params));
    const positions = result.Items?.map((Item: PositionReadModel) => unmarshall(Item));

    if (positions) {
      console.log(`🔔 Found ${positions.length} Positions`);

      return positions as [PositionReadModel];
    } else {
      console.log(`🔔 No Positions found`);

      return [{}] as [PositionReadModel];
    }
  } catch (e) {
    console.log(`❌ Error looking for Position: ${e}`);

    return [{}] as [PositionReadModel];
  }
}

async function updateAccountValuesAsync(account: AccountReadModel, positions: [PositionReadModel]) {
  var bookValue = 0;
  var marketValue = 0;
  positions.map((p) => {
    bookValue += p.bookValue;
    marketValue += p.marketValue;
  });

  const updateItemCommandInput = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Key: marshall({
      id: account.id,
    }),
    UpdateExpression: 'SET version=:version, bookValue=:bookValue, marketValue=:marketValue',
    ExpressionAttributeValues: marshall({
      ':version': account.version + 1,
      ':bookValue': bookValue,
      ':marketValue': marketValue,
    }),
    ReturnValues: 'ALL_NEW',
  };
  const command = new UpdateItemCommand(updateItemCommandInput);

  var result;
  try {
    var client = new DynamoDBClient({ region: process.env.REGION });

    console.log('🔔 Updating DynamoDB item');
    console.debug(`DynamoDB item: ${JSON.stringify(updateItemCommandInput)}`);

    result = await client.send(command);
  } catch (error) {
    console.error(`❌ Error with updating DynamoDB item`, error);
  }

  console.log(`✅ Updated item in DynamoDB: ${JSON.stringify(result)}`);
}

import { EventBridgeEvent } from 'aws-lambda';
import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { getQuoteSummary } from './yahooFinance';
import { PositionReadModel } from '../types/Position';
import dynamoDbCommand from './helpers/dynamoDbCommand';

exports.handler = async (event: EventBridgeEvent<string, PositionReadModel>) => {
  const detail = parseEvent(event);

  // Save Position - create if not exists, update if exists
  return await savePosition(detail);
};

async function savePosition(position: PositionReadModel) {
  // Get quote for symbol
  const quote = await getQuoteSummary(position.symbol);

  let result;

  if (quote && quote.close) {
    // Calculate market value
    const marketValue = quote.close * position.shares;

    const item = {
      pk: position.pk,
      userId: position.userId,
      createdAt: position ? position.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accountId: position.accountId,
      entity: 'position',
      symbol: quote.symbol,
      description: quote.description,
      exchange: quote.exchange,
      currency: quote.currency,
      shares: position.shares,
      acb: position.acb,
      bookValue: position.bookValue,
      marketValue: marketValue,
    };

    const putItemCommandInput: PutItemCommandInput = {
      TableName: process.env.DATA_TABLE_NAME,
      Item: marshall(item),
    };
    result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

    if (result.$metadata.httpStatusCode === 200) {
      console.log(`✅ Saved Position: { result: ${JSON.stringify(result)}, items: ${JSON.stringify(item)} }`);
      return result.Items;
    }
  }

  console.log(`🛑 Could not save Position ${position.symbol}:`, result);
  return {};
}

function parseEvent(event: EventBridgeEvent<string, PositionReadModel>): PositionReadModel {
  const eventString: string = JSON.stringify(event);

  console.debug(`🕧 Received event: ${eventString}`);

  return JSON.parse(eventString).detail;
}

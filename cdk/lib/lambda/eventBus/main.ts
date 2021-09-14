import { DynamoDBStreamEvent } from 'aws-lambda';
import { PutEventsRequest, PutEventsRequestEntry } from '@aws-sdk/client-cloudwatch-events';
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');

exports.handler = async (event: DynamoDBStreamEvent) => {
  console.log(`Received ${event.Records.length} message(s)`);

  var events: PutEventsRequest = { Entries: [] as PutEventsRequestEntry[] };

  for (const record of event.Records) {
    console.log(`Processing ${record.eventID}`);
    console.debug(`DynamoDB stream record: ${JSON.stringify(record)}`);

    if (!record.dynamodb) {
      console.warn('🔔 EVENT IS EMPTY. SKIP PROCESSING STREAM');
      return;
    }

    // Do not process manually deleted events from the table
    if (record.dynamodb.OldImage) {
      console.warn('🔔 EVENT WAS MANUALLY DELETED. DO NOT PROCESS STREAM');
      return;
    }

    if (record.dynamodb.NewImage) {
      var aggregateId = record.dynamodb.NewImage?.aggregateId.S?.trim();
      var userId = record.dynamodb.NewImage.userId.S?.trim();
      var version = record.dynamodb.NewImage.version.N;
      var eventName = record.dynamodb.NewImage.name.S?.trim();
      var data = record.dynamodb.NewImage.data.S?.trim();
    }

    var entry: PutEventsRequestEntry = {
      Source: 'custom.pecuniary',
      EventBusName: process.env.EVENTBUS_PECUNIARY_NAME,
      DetailType: eventName,
      Detail: JSON.stringify({
        aggregateId: aggregateId,
        eventName: eventName,
        version: version,
        userId: userId,
        data: data,
      }),
    };

    events.Entries?.push(entry);
  }

  // Send events to EventBridge
  await sendEventAsync(events);
};

async function sendEventAsync(events: PutEventsRequest) {
  const client = new EventBridgeClient();
  var command = new PutEventsCommand(events);

  var result;
  try {
    console.log(`🔔 Sending ${events.Entries?.length} event(s) to EventBridge`);
    console.debug(`EventBridge event: ${JSON.stringify(events)}`);

    result = await client.send(command);
  } catch (error) {
    console.error(error);
  } finally {
    console.log(`✅ Successfully sent ${events.Entries?.length} event(s) to EventBridge: ${JSON.stringify(result)}`);
  }
}

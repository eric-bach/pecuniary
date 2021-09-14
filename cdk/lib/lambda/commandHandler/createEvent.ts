const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();
const { v4: uuid } = require('uuid');

import Event from './types/Event';

async function createEvent(event: Event) {
  if (!event.id) {
    event.id = uuid();

    console.log(`createEvent: Creating new Id ${event.id}`);
  }

  const params = {
    TableName: process.env.EVENT_TABLE_NAME,
    Item: event,
  };

  try {
    console.debug(`createEvent: ${params}`);

    await client.put(params).promise();

    console.log(`✅ createEvent succeeded`);

    return event;
  } catch (err) {
    console.error('❌ createEvent error: ', err);

    return null;
  }
}

export default createEvent;

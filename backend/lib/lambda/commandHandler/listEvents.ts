const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

async function listEvents() {
  const params = {
    TableName: process.env.EVENT_TABLE_NAME,
  };

  try {
    console.debug(`listEvents: ${JSON.stringify(params)}`);

    const data = await client.scan(params).promise();

    console.log(`✅ listEvents found: ${JSON.stringify(data.Items)}`);

    // TODO Set nextToken value
    return { items: data.Items, nextToken: null };
  } catch (err) {
    console.error('❌ listEvents error: ', err);

    return null;
  }
}

export default listEvents;

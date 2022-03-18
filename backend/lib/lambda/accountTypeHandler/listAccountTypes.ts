const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

async function listAccountTypes() {
  const params = {
    TableName: process.env.ACCOUNT_TYPE_TABLE_NAME,
  };

  try {
    console.debug(`listAccountTypes: ${JSON.stringify(params)}`);

    const data = await client.scan(params).promise();

    console.log(`✅ listAccountTypes found: ${JSON.stringify(data.Items)}`);

    return data.Items;
  } catch (err) {
    console.error('❌ listAccountTypes error: ', err);

    return null;
  }
}

export default listAccountTypes;

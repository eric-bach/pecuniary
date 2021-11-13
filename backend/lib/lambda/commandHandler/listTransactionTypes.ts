const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

async function listTransactionTypes() {
  const params = {
    TableName: process.env.TRANSACTION_TYPE_TABLE_NAME,
  };

  try {
    console.debug(`listTransactionTypes: ${JSON.stringify(params)}`);

    const data = await client.scan(params).promise();

    console.log(`✅ listTransactionTypes found: ${JSON.stringify(data.Items)}`);

    return data.Items;
  } catch (err) {
    console.error('❌ listTransactionTypes error: ', err);

    return null;
  }
}

export default listTransactionTypes;

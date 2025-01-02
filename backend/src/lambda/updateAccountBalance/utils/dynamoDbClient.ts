const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

async function dynamoDbCommand(command: any) {
  let result;

  try {
    console.debug(`ℹ️ Initializing DynamoDB client in ${process.env.REGION}`);
    const client = new DynamoDBClient({ region: process.env.REGION });

    console.debug(`ℹ️ Executing DynamoDB command:\n${JSON.stringify(command)}`);
    result = await client.send(command);

    console.log(`🔔 DynamoDB result:\n${JSON.stringify(result)}`);
  } catch (error) {
    throw new Error(`🛑 Error with DynamoDB command:\n ${error}`);
  }

  return result;
}

export default dynamoDbCommand;

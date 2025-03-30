const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

async function dynamoDbCommand(logger: any, command: any) {
  let result;

  try {
    logger.debug(`Initializing DynamoDB client in ${process.env.REGION}`);
    const client = new DynamoDBClient({ region: process.env.REGION });

    logger.debug('Executing DynamoDB command', { data: command });
    result = await client.send(command);

    logger.info('🔔 DynamoDB result', { data: result });
  } catch (error) {
    throw new Error(`🛑 Error with DynamoDB command:\n ${error}`);
  }

  return result;
}

export default dynamoDbCommand;

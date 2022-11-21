import { DynamoDB } from 'aws-sdk'
import type { Converter } from 'aws-sdk/lib/dynamodb/converter';


let marshall: typeof Converter.marshall;
let unmarshall: typeof Converter.unmarshall;
let client: DynamoDB.DocumentClient

const getDynamoDBClient = async () => {
  if (!client) {
    client = new DynamoDB.DocumentClient()
    marshall = DynamoDB.Converter?.marshall;
    unmarshall = DynamoDB.Converter?.unmarshall;
  }

  return client;
};

export { getDynamoDBClient, marshall, unmarshall };

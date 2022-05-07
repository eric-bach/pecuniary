import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { marshall } from '@aws-sdk/util-dynamodb';
import * as fs from 'fs';

async function seed() {
  try {
    // Get DynamoDB table name
    const tableName = await getTableName('pecuniary-dev');
    console.log('✅ Seed table: ', tableName);

    // Read items to see from data/seeds.json
    const data = getSeedData('./data/seeds.json');
    console.log('✅ Seed data: ', data);

    console.log('\n🚀 Starting to seed table...');

    // Seed each item in table
    data.map(async (item: any) => {
      await seedItem(tableName, item);
    });
  } catch (error) {
    console.error('🛑 Error seeding database\n', error);
    process.exit(-1);
  }
}

async function seedItem(tableName: string, item: any) {
  const putItemCommandInput: PutItemCommandInput = {
    TableName: tableName,
    Item: marshall(item),
  };

  await dynamoDbCommand(new PutItemCommand(putItemCommandInput));
}

function getSeedData(file: string) {
  try {
    const jsonString = fs.readFileSync(file);
    const data = JSON.parse(jsonString.toString());

    return data;
  } catch (err) {
    console.error('🛑 Error reading seed file\n', err);
    return;
  }
}

async function getTableName(stackName: string): Promise<string> {
  var tableName: string = 'pecuniary-dev-Data';

  const client = new CloudFormationClient({});
  const command = new DescribeStacksCommand({ StackName: stackName });
  const response = await client.send(command);

  if (response && response.$metadata.httpStatusCode === 200) {
    const outputs = response.Stacks![0].Outputs;
    const output = outputs?.filter((o) => o.OutputKey === 'DataTableName')[0];
    tableName = output?.OutputValue!;
  }

  return tableName;
}

async function dynamoDbCommand(command: any) {
  var result;

  try {
    var client = new DynamoDBClient({});

    console.debug(`🔔 Seeding item: ${JSON.stringify(command)}`);
    result = await client.send(command);

    console.log(`🔔 DynamoDB result:${JSON.stringify(result)}`);
  } catch (error) {
    console.error(`🛑 Error with DynamoDB command:\n`, error);
  }

  return result;
}

seed();

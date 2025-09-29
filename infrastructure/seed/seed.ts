import { ConditionalCheckFailedException, DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { marshall } from '@aws-sdk/util-dynamodb';
import * as fs from 'fs';

const STACK_NAME = 'pecuniary-data-dev';

type Account = {
  pk: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  name: string;
  type: string;
  entity: string;
  userId: string;
};

async function seed() {
  try {
    // Get DynamoDB table name
    const tableName = await getTableName(STACK_NAME);
    console.log(' ✅ Verify table exists:', tableName);

    // Read items to see from data.json
    const data: Account[] = getSeedData('./data.json');
    console.log(` ✅ Parsed seed data: ${data.length} objects`);

    console.log('\n🚀 Seeding table...\n');
    // Seed each item in table
    data.map(async (item: Account) => {
      await seedItem(tableName, item);
    });
  } catch (error) {
    console.error('🛑 Error seeding database\n', error);
    process.exit(-1);
  }
}

async function seedItem(tableName: string, item: Account) {
  //item.sk = item.sk + new Date().toISOString();
  item.updatedAt = new Date().toISOString();

  const putItemCommandInput: PutItemCommandInput = {
    TableName: tableName,
    Item: marshall(item),
    ConditionExpression: 'attribute_not_exists(pk)',
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
  let tableName: string = 'pecuniary-data-dev';

  const client = new CloudFormationClient({});
  const command = new DescribeStacksCommand({ StackName: stackName });
  const response = await client.send(command);

  if (response && response.$metadata.httpStatusCode === 200) {
    const outputs = response.Stacks![0].Outputs;
    const output = outputs?.filter((o) => o.OutputKey === 'DataTableName')[0];
    tableName = output?.OutputValue ?? tableName;
  }

  return tableName;
}

async function dynamoDbCommand(command: PutItemCommand) {
  let result;

  try {
    const client = new DynamoDBClient({});

    console.debug(` 🔔 Seeding item: ${JSON.stringify(command.input.Item)}`);
    result = await client.send(command);

    console.log(` ✔️  DynamoDB result:${JSON.stringify(result.$metadata)}`);
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      console.warn(` ✔️  Item already exists, skipping`);
    } else {
      console.error(`🛑 Error with DynamoDB command:\n`, error);
    }
  }

  return result;
}

seed();

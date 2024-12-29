import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const eventBridgeClient = new EventBridgeClient({});

exports.handler = async (event: any) => {
  const putEventsCommand = new PutEventsCommand({
    Entries: [
      {
        Source: 'appsync.createBankTransaction',
        DetailType: 'TransactionSavedEvent',
        Detail: JSON.stringify(event),
        EventBusName: process.env.EVENT_BUS_NAME,
      },
    ],
  });

  await eventBridgeClient.send(putEventsCommand);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Event published successfully' }),
  };
};

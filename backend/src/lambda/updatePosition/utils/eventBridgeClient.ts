const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');

async function publishEventAsync(detailType: string, detail: any) {
  const params = {
    Entries: [
      {
        Source: 'custom.pecuniary',
        EventBusName: process.env.EVENTBUS_PECUNIARY_NAME,
        DetailType: detailType,
        Detail: JSON.stringify(detail),
      },
    ],
  };

  try {
    console.debug(`🕧 Initializing EventBridge client in ${process.env.REGION}`);
    const client = new EventBridgeClient({ region: process.env.REGION });

    console.debug(`🕧 Sending ${JSON.stringify(params)} event to EventBridge`);
    const command = new PutEventsCommand(params);

    const result = await client.send(command);
    console.log(`🔔 EventBridge result:\n${JSON.stringify(result)}`);
  } catch (error) {
    throw Error(`🛑 Error sending EventBridge event:\n${error}`);
  }

  console.log(`✅ Sent ${params.Entries.length} event(s) to EventBridge`);
}

export default publishEventAsync;

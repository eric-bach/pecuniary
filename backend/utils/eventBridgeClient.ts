const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');

async function publishEventAsync(logger: any, detailType: string, detail: any) {
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
    logger.debug(`Initializing EventBridge client in ${process.env.REGION}`);
    const client = new EventBridgeClient({ region: process.env.REGION });

    logger.debug('Sending event to EventBridge', { event: params });
    const command = new PutEventsCommand(params);

    const result = await client.send(command);
    logger.info('🔔 EventBridge result', { data: result });
  } catch (error) {
    throw Error(`🛑 Error sending EventBridge event:\n${error}`);
  }

  logger.info('✅ Sent event(s) to EventBridge', { data: { events: params.Entries.length } });
}

export default publishEventAsync;

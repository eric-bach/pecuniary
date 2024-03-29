import getPositions from './getPositions';

import { PositionAppSyncEvent } from '../types/Position';

exports.handler = async (event: PositionAppSyncEvent) => {
  console.debug(`🕧 AppSync event: ${JSON.stringify(event)}`);
  console.debug(`🕧 AppSync info: ${JSON.stringify(event.info)}`);
  console.debug(`🕧 AppSync arguments: ${JSON.stringify(event.arguments)}`);

  switch (event.info.fieldName) {
    // Queries
    case 'getPositions':
      console.debug(`🔔 GetPositions: ${JSON.stringify(event.arguments.userId)} ${JSON.stringify(event.arguments.aggregateId)}`);
      return await getPositions(event.arguments.userId, event.arguments.aggregateId);

    default:
      console.error(`🛑 No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

import getPositionsByAccountId from './getPositionsByAccountId';

import { PositionAppSyncEvent } from '../types/Position';

exports.handler = async (event: PositionAppSyncEvent) => {
  console.debug(`AppSync event: ${JSON.stringify(event)}`);
  console.debug(`AppSync info: ${JSON.stringify(event.info)}`);
  console.debug(`AppSync arguments: ${JSON.stringify(event.arguments)}`);

  switch (event.info.fieldName) {
    // Queries
    case 'getPositionsByAccountId':
      console.debug(`🔔 GetPositionsByAccountId: ${JSON.stringify(event.arguments.accountId)}`);
      return await getPositionsByAccountId(event.arguments.accountId);

    default:
      console.error(`❌ No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

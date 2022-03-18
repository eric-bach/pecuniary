import listAccountTypes from './listAccountTypes';

import { AccountTypeAppSyncEvent } from '../types/AccountType';

exports.handler = async (event: AccountTypeAppSyncEvent) => {
  console.debug(`AppSync event: ${JSON.stringify(event)}`);
  console.debug(`AppSync info: ${JSON.stringify(event.info)}`);
  console.debug(`AppSync arguments: ${JSON.stringify(event.arguments)}`);

  switch (event.info.fieldName) {
    // Queries
    case 'listAccountTypes':
      console.debug(`🔔 ListAccountTypes`);
      return await listAccountTypes();

    default:
      console.error(`❌ No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

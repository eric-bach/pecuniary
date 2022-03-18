import listTransactionTypes from './listTransactionTypes';

import { TransactionTypeAppSyncEvent } from '../types/TransactionType';

exports.handler = async (event: TransactionTypeAppSyncEvent) => {
  console.debug(`AppSync event: ${JSON.stringify(event)}`);
  console.debug(`AppSync info: ${JSON.stringify(event.info)}`);
  console.debug(`AppSync arguments: ${JSON.stringify(event.arguments)}`);

  switch (event.info.fieldName) {
    case 'listTransactionTypes':
      console.debug(`🔔 ListTransactionTypes`);
      return await listTransactionTypes();

    default:
      console.error(`❌ No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

import getTransactionsByAccountId from './getTransactionsByAccountId';
import createTransaction from './createTransaction';
import updateTransaction from './updateTransaction';
import deleteTransaction from './deleteTransaction';

import { TransactionAppSyncEvent } from '../types/Transaction';

exports.handler = async (event: TransactionAppSyncEvent) => {
  console.debug(`AppSync event: ${JSON.stringify(event)}`);
  console.debug(`AppSync info: ${JSON.stringify(event.info)}`);
  console.debug(`AppSync arguments: ${JSON.stringify(event.arguments)}`);

  switch (event.info.fieldName) {
    case 'getTransactionsByAccountId':
      console.debug(`🔔 GetTransactionsByAccountId: ${JSON.stringify(event.arguments.accountId)}`);
      return await getTransactionsByAccountId(event.arguments.accountId);

    case 'createTransaction':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.createTransactionInput)}`);
      return await createTransaction(event.arguments.createTransactionInput);
    case 'updateTransaction':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.updateTransactionInput)}`);
      return await updateTransaction(event.arguments.updateTransactionInput);
    case 'deleteTransaction':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.deleteTransactionInput)}`);
      return await deleteTransaction(event.arguments.deleteTransactionInput);

    default:
      console.error(`❌ No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

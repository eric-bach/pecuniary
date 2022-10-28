import getAccounts from './getAccounts';
import createAccount from './createAccount';
import updateAccount from './updateAccount';
import deleteAccount from './deleteAccount';

import { AccountAppSyncEvent } from '../types/Account';

exports.handler = async (event: AccountAppSyncEvent) => {
  console.debug(`🕧 AppSync event: ${JSON.stringify(event)}`);
  console.debug(`🕧 AppSync info: ${JSON.stringify(event.info)}`);
  console.debug(`🕧 AppSync arguments: ${JSON.stringify(event.arguments)}`);

  switch (event.info.fieldName) {
    // Queries
    case 'getAccounts':
      console.debug(`🔔 GetAccounts: ${JSON.stringify(event.arguments.userId)}`);
      return await getAccounts(event.arguments.userId, event.arguments.aggregateId, event.arguments.lastEvaluatedKey);

    // Mutations
    case 'createAccount':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.createAccountInput)}`);
      return await createAccount(event.arguments.createAccountInput);
    case 'updateAccount':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.updateAccountInput)}`);
      return await updateAccount(event.arguments.updateAccountInput);
    case 'deleteAccount':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.deleteAccountInput)}`);
      return await deleteAccount(event.arguments.deleteAccountInput);

    default:
      console.error(`🛑 No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

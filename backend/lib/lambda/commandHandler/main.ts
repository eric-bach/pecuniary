// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.02
import createEvent from './createEvent';
import listEvents from './listEvents';
import getAccountByAggregateId from './getAccountByAggregateId';
import getAccountsByUser from './getAccountsByUser';
import getPositionsByAccountId from './getPositionsByAccountId';
import getTransactionsByAccountId from './getTransactionsByAccountId';
import listAccountTypes from './listAccountTypes';
import listTransactionTypes from './listTransactionTypes';

import AppSyncEvent from './types/AppSyncEvent';

exports.handler = async (event: AppSyncEvent) => {
  console.debug(`AppSync event: ${JSON.stringify(event)}`);
  console.debug(`AppSync arguments: ${JSON.stringify(event.arguments)}`);

  switch (event.info.fieldName) {
    // Queries
    case 'listEvents':
      console.debug(`🔔 ListEvents`);
      return await listEvents();
    case 'listAccountTypes':
      console.debug(`🔔 ListAccountTypes`);
      return await listAccountTypes();
    case 'listTransactionTypes':
      console.debug(`🔔 ListTransactionTypes`);
      return await listTransactionTypes();

    case 'getAccountByAggregateId':
      console.debug(`🔔 GetAccount: ${JSON.stringify(event.arguments.aggregateId)}`);
      return await getAccountByAggregateId(event.arguments.aggregateId);
    case 'getAccountsByUser':
      console.debug(`🔔 GetAccountsByUser: ${JSON.stringify(event.arguments.userId)}`);
      return await getAccountsByUser(event.arguments.userId);
    case 'getPositionsByAccountId':
      console.debug(`🔔 GetPositionsByAccountId: ${JSON.stringify(event.arguments.accountId)}`);
      return await getPositionsByAccountId(event.arguments.accountId);
    case 'getTransactionsByAccountId':
      console.debug(`🔔 GetTransactionsByAccountId: ${JSON.stringify(event.arguments.accountId)}`);
      return await getTransactionsByAccountId(event.arguments.accountId);

    // Mutations
    case 'createEvent':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.event)}`);
      return await createEvent(event.arguments.event);

    default:
      console.error(`❌ No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.02
import createEvent from './createEvent';
import listEvents from './listEvents';
import listAccountTypes from './listAccountTypes';
import getAccountsByUser from './getAccountsByUser';

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
    case 'getAccountsByUser':
      console.debug(`🔔 GetAccountsByUser: ${JSON.stringify(event.arguments.userId)}`);
      return await getAccountsByUser(event.arguments.userId);

    // Mutations
    case 'createEvent':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.event)}`);
      return await createEvent(event.arguments.event);

    default:
      console.error(`❌ No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

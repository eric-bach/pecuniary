import createBankTransaction from './createBankTransaction';
import createInvestmentTransaction from './createInvestmentTransaction';
import updateBankTransaction from './updateBankTransaction';
import updateInvestmentTransaction from './updateInvestmentTransaction';
import deleteTransaction from './deleteTransaction';

import { TransactionAppSyncEvent } from '../types/Transaction';
import {
  CreateBankTransactionInput,
  CreateInvestmentTransactionInput,
  DeleteTransactionInput,
  UpdateBankTransactionInput,
  UpdateInvestmentTransactionInput,
} from '../../appsync/api/codegen/appsync';

exports.handler = async (event: TransactionAppSyncEvent) => {
  console.debug(`🕧 AppSync event: ${JSON.stringify(event)}`);
  console.debug(`🕧 AppSync info: ${JSON.stringify(event.info)}`);
  console.debug(`🕧 AppSync arguments: ${JSON.stringify(event.arguments)}`);

  switch (event.info.fieldName) {
    case 'createBankTransaction':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.input)}`);
      return await createBankTransaction(event.identity.username, event.arguments.input as CreateBankTransactionInput);

    case 'updateBankTransaction':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.input)}`);
      return await updateBankTransaction(event.identity.username, event.arguments.input as UpdateBankTransactionInput);

    case 'createInvestmentTransaction':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.input)}`);
      return await createInvestmentTransaction(event.identity.username, event.arguments.input as CreateInvestmentTransactionInput);

    case 'updateInvestmentTransaction':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.input)}`);
      return await updateInvestmentTransaction(event.identity.username, event.arguments.input as UpdateInvestmentTransactionInput);

    case 'deleteTransaction':
      console.debug(`🔔 ${event.info.fieldName} GraphQL data: ${JSON.stringify(event.arguments.input)}`);
      return await deleteTransaction(event.arguments.input as DeleteTransactionInput);

    default:
      console.error(`🛑 No AppSync resolver defined for ${event.info.fieldName}`);
      return null;
  }
};

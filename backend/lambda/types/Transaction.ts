import {
  CreateBankTransactionInput,
  CreateInvestmentTransactionInput,
  DeleteTransactionInput,
  UpdateBankTransactionInput,
  UpdateInvestmentTransactionInput,
} from '../../../infrastructure/graphql/api/codegen/appsync';

export type TransactionAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    input:
      | CreateBankTransactionInput
      | CreateInvestmentTransactionInput
      | UpdateBankTransactionInput
      | UpdateInvestmentTransactionInput
      | DeleteTransactionInput;
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

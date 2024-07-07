// This is manually created until we have a better way to generate this

import { Account, Aggregates, DeleteResponse, GetAccountsResponse, GetTransactionsResponse, Transaction } from './codegen/appsync';

export type Query<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export type GetAccountQuery = {
  getAccount: Account;
};

export type GetAccountsQuery = {
  getAccounts: GetAccountsResponse;
};

export type GetTransactionsQuery = {
  getTransactions: GetTransactionsResponse;
};

export type CreateAccountMutation = {
  createAccount: Account;
};

export type UpdateAccountMutation = {
  updateAccount: Account;
};

export type DeleteAccountMutation = {
  deleteAccount: Aggregates;
};

export type CreateTransactionMutation = {
  createTransaction: Transaction;
};

export type UpdateTransactionMutation = {
  updateTransaction: Transaction;
};

export type DeleteTransactionMutation = {
  deleteTransaction: DeleteResponse;
};

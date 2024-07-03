// This is manually created until we have a better way to generate this

import {
  Account,
  Aggregates,
  CreateAccountInput,
  GetAccountsResponse,
  GetTransactionsResponse,
  UpdateAccountInput,
} from './codegen/appsync';

export type Query<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export type GetAccountQueryVariables = {
  accountId: String;
};

export type GetAccountQuery = {
  getAccount: Account;
};

export type GetAccountsQueryVariables = {
  lastEvaluatedKey: String;
  limit?: number | null;
};

export type GetAccountsQuery = {
  getAccounts: GetAccountsResponse;
};

export type GetTransactionsQueryVariables = {
  accountId: String;
  lastEvaluatedKey: String;
};

export type GetTransactionsQuery = {
  getTransactions: GetTransactionsResponse;
};

export type CreateAccountsInputVariables = {
  input: CreateAccountInput;
};

export type CreateAccountMutation = {
  createAccount: Account;
};

export type UpdateAccountInputVariables = {
  input: UpdateAccountInput;
};

export type UpdateAccountMutation = {
  updateAccount: Account;
};

export type DeleteAccountsInputVariables = {
  accountId: String;
};

export type DeleteAccountMutation = {
  deleteAccount: Aggregates;
};

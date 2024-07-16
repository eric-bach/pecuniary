// This is manually created until we have a better way to generate this

import {
  Account,
  Aggregates,
  BankTransaction,
  Category,
  DeleteResponse,
  GetAccountsResponse,
  GetBankTransactionsResponse,
  GetCategoriesResponse,
  GetInvestmentTransactionsResponse,
  InvestmentTransaction,
} from './codegen/appsync';

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

export type GetBankTransactionsQuery = {
  getBankTransactions: GetBankTransactionsResponse;
};

export type GetInvestmentTransactionsQuery = {
  getInvestmentTransactions: GetInvestmentTransactionsResponse;
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

export type CreateBankTransactionMutation = {
  createBankTransaction: BankTransaction;
};

export type UpdateBankTransactionMutation = {
  updateBankTransaction: BankTransaction;
};

export type CreateInvestmentTransactionMutation = {
  createInvestmentTransaction: InvestmentTransaction;
};

export type UpdateInvestmentTransactionMutation = {
  updateInvestmentTransaction: InvestmentTransaction;
};

export type DeleteTransactionMutation = {
  deleteTransaction: DeleteResponse;
};

export type CreateCategoryMutation = {
  createCategory: Category;
};

export type GetCategoriesQuery = {
  getCategories: GetCategoriesResponse;
};

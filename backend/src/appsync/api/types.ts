// This is manually created until we have a better way to generate this

import {
  Account,
  Aggregates,
  BankTransaction,
  Category,
  DeleteTransaction,
  GetAccountsResponse,
  GetBankTransactionsResponse,
  GetCategoriesResponse,
  GetInvestmentTransactionsResponse,
  GetPayeesResponse,
  GetSymbolsResponse,
  InvestmentTransaction,
  Payee,
  Symbol,
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
  deleteTransaction: DeleteTransaction;
};

export type CreateCategoryMutation = {
  createCategory: Category;
};

export type UpdateCategoryMutation = {
  updateCategory: Category;
};

export type GetCategoriesQuery = {
  getCategories: GetCategoriesResponse;
};

export type CreatePayeeMutation = {
  createPayee: Payee;
};

export type UpdatePayeeMutation = {
  updatePayee: Payee;
};

export type GetPayeesQuery = {
  getPayees: GetPayeesResponse;
};

export type CreateSymbolMutation = {
  createSymbol: Symbol;
};

export type GetSymbolsQuery = {
  getSymbols: GetSymbolsResponse;
};

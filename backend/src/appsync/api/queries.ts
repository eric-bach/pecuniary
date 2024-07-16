import {
  QueryGetAccountArgs,
  QueryGetAccountsArgs,
  QueryGetBankTransactionsArgs,
  QueryGetCategoriesArgs,
  QueryGetInvestmentTransactionsArgs,
  QueryGetPayeesArgs,
} from './codegen/appsync';
import {
  GetAccountQuery,
  GetAccountsQuery,
  GetBankTransactionsQuery,
  GetCategoriesQuery,
  GetInvestmentTransactionsQuery,
  GetPayeesQuery,
  Query,
} from './types';

export const getAccount = `query GetAccount($accountId: String!) {
  getAccount(accountId: $accountId) { 
    accountId
    name
    category
    type
    createdAt
    updatedAt
  }
}` as Query<QueryGetAccountArgs, GetAccountQuery>;

export const getAccounts = `query GetAccounts($lastEvaluatedKey: String) {
  getAccounts(lastEvaluatedKey: $lastEvaluatedKey) { 
    items {
      accountId
      name
      category
      type
      createdAt
      updatedAt
    }
    nextToken
  }
}` as Query<QueryGetAccountsArgs, GetAccountsQuery>;

export const getBankTransactions = `query GetBankTransactions($accountId: String!, $lastEvaluatedKey: String) {
  getBankTransactions(accountId: $accountId, lastEvaluatedKey: $lastEvaluatedKey) { 
    items {
      pk
      createdAt
      entity
      accountId
      transactionId
      transactionDate
      payee
      category
      amount
      createdAt
      updatedAt
    }
    nextToken
  }
}` as Query<QueryGetBankTransactionsArgs, GetBankTransactionsQuery>;

export const getInvestmentTransactions = `query GetBankTransactions($accountId: String!, $lastEvaluatedKey: String) {
  getInvestmentTransactions(accountId: $accountId, lastEvaluatedKey: $lastEvaluatedKey) { 
    items {
      pk
      createdAt
      entity
      accountId
      transactionId
      transactionDate
      type
      symbol
      shares
      price 
      commission
      createdAt
      updatedAt
    }
    nextToken
  }
}` as Query<QueryGetInvestmentTransactionsArgs, GetInvestmentTransactionsQuery>;

export const getCategories = `query GetCategories($lastEvaluatedKey: String) {
  getCategories(lastEvaluatedKey: $lastEvaluatedKey) {
    items {
      name
      createdAt
      updatedAt
    }
    nextToken
  }
}` as Query<QueryGetCategoriesArgs, GetCategoriesQuery>;

export const getPayees = `query GetPayees($lastEvaluatedKey: String) {
  getPayees(lastEvaluatedKey: $lastEvaluatedKey) {
    items {
      name
      createdAt
      updatedAt
    }
    nextToken
  }
}` as Query<QueryGetPayeesArgs, GetPayeesQuery>;

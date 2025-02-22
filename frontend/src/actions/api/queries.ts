import {
  QueryGetAccountArgs,
  QueryGetAccountsArgs,
  QueryGetBankTransactionsArgs,
  QueryGetCategoriesArgs,
  QueryGetInvestmentTransactionsArgs,
  QueryGetPayeesArgs,
  QueryGetSymbolsArgs,
} from '@/../../../backend/src/appsync/api/codegen/appsync';
import {
  GetAccountQuery,
  GetAccountsQuery,
  GetBankTransactionsQuery,
  GetCategoriesQuery,
  GetInvestmentTransactionsQuery,
  GetPayeesQuery,
  GetSymbolsQuery,
  Query,
} from '@/../../../backend/src/appsync/api/types';

export const getAccount = `query GetAccount($accountId: String!) {
  getAccount(accountId: $accountId) { 
    accountId
    name
    category
    type
    balance
    bookValue
    marketValue
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
      balance
      bookValue
      marketValue
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
      pk
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
      pk
      name
      createdAt
      updatedAt
    }
    nextToken
  }
}` as Query<QueryGetPayeesArgs, GetPayeesQuery>;

export const getSymbols = `query GetSymbols($lastEvaluatedKey: String) {
  getSymbols(lastEvaluatedKey: $lastEvaluatedKey) {
    items {
      pk
      name
      createdAt
      updatedAt
    }
    nextToken
  }
}` as Query<QueryGetSymbolsArgs, GetSymbolsQuery>;

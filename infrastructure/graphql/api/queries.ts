import {
  QueryGetAccountArgs,
  QueryGetAccountsArgs,
  QueryGetBankTransactionsArgs,
  QueryGetInvestmentTransactionsArgs,
} from './codegen/appsync';
import { GetAccountQuery, GetAccountsQuery, GetBankTransactionsQuery, GetInvestmentTransactionsQuery, Query } from './types';

export const getAccount = `query GetAccount($accountId: String!) {
  getAccount(accountId: $accountId) { 
    accountId
    name
    entity
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
      entity
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
      accountId
      entity
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
      accountId
      entity
      type
      transactionDate
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

import { QueryGetAccountsArgs } from './codegen/appsync';
import {
  GetAccountQuery,
  GetAccountQueryVariables,
  GetAccountsQuery,
  GetAccountsQueryVariables,
  GetTransactionsQuery,
  GetTransactionsQueryVariables,
  Query,
} from './types';

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
}` as Query<GetAccountQueryVariables, GetAccountQuery>;

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

export const getTransactions = `query GetTransactions($accountId: String!, $lastEvaluatedKey: String) {
  getTransactions(accountId: $accountId, lastEvaluatedKey: $lastEvaluatedKey) { 
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
}` as Query<GetTransactionsQueryVariables, GetTransactionsQuery>;

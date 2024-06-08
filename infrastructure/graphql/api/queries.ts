import { GetAccountQuery, GetAccountQueryVariables, GetAccountsQuery, GetAccountsQueryVariables, Query } from './types';

export const getAccount = `query GetAccount($accountId: String!) {
  getAccount(accountId: $accountId) { 
    accountId
    name
    entity
    type
    createdAt
    updatedAt
  }
}` as Query<GetAccountQueryVariables, GetAccountQuery>;

export const getAccounts = `query GetAccounts {
  getAccounts { 
    accountId
    name
    entity
    type
    createdAt
    updatedAt
  }
}` as Query<GetAccountsQueryVariables, GetAccountsQuery>;

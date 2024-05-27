import { GetAccountsQuery, GetAccountsQueryVariables, Query } from './types';

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

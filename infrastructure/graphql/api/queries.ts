import { GetAccountsQuery, GetAccountsQueryVariables, CreateAccountMutation, Query, CreateAccountsInputVariables } from './types';

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

export const createAccount = `mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) { 
    accountId
    name
    entity
    type
    createdAt
    updatedAt
  }
}` as Query<CreateAccountsInputVariables, CreateAccountMutation>;

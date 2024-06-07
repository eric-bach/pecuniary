import { CreateAccountMutation, Query, CreateAccountsInputVariables, DeleteAccountsInputVariables, DeleteAccountMutation } from './types';

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

export const deleteAccount = `mutation DeleteAccount($accountId: String!) {
    deleteAggregate(accountId: $accountId) { 
      items {
        accountId
        name
        entity
        type
        createdAt
        updatedAt
      }
    }
  }` as Query<DeleteAccountsInputVariables, DeleteAccountMutation>;

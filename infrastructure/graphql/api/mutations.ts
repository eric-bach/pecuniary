import {
  CreateAccountMutation,
  Query,
  CreateAccountsInputVariables,
  DeleteAccountsInputVariables,
  DeleteAccountMutation,
  UpdateAccountInputVariables,
  UpdateAccountMutation,
} from './types';

export const createAccount = `mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) { 
      accountId
      name
      entity
      category
      type
      createdAt
      updatedAt
    }
  }` as Query<CreateAccountsInputVariables, CreateAccountMutation>;

export const updateAccount = `mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) { 
      accountId
      name
      entity
      type
      createdAt
      updatedAt
    }
  }` as Query<UpdateAccountInputVariables, UpdateAccountMutation>;

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

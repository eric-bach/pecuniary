import {
  MutationCreateAccountArgs,
  MutationCreateTransactionArgs,
  MutationDeleteAggregateArgs,
  MutationDeleteTransactionArgs,
  MutationUpdateAccountArgs,
  MutationUpdateTransactionArgs,
} from './codegen/appsync';
import {
  CreateAccountMutation,
  Query,
  DeleteAccountMutation,
  UpdateAccountMutation,
  DeleteTransactionMutation,
  CreateTransactionMutation,
  UpdateTransactionMutation,
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
  }` as Query<MutationCreateAccountArgs, CreateAccountMutation>;

export const updateAccount = `mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) { 
      accountId
      name
      entity
      type
      createdAt
      updatedAt
    }
  }` as Query<MutationUpdateAccountArgs, UpdateAccountMutation>;

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
  }` as Query<MutationDeleteAggregateArgs, DeleteAccountMutation>;

export const createTransaction = `mutation CreateTransaction($createTransactionInput: CreateTransactionInput!) {
    createTransaction(createTransactionInput: $createTransactionInput) { 
      pk
      createdAt
      userId
      entity
      accountId
      type
      transactionDate
      sybmol
      shares
      price
      commission
      updatedAt
    }
  }` as Query<MutationCreateTransactionArgs, CreateTransactionMutation>;

export const updateTransaction = `mutation CreateTransaction($updateTransactionInput: UpdateTransactionInput!) {
  updateTransaction(updateTransactionInput: $updateTransactionInput) { 
    pk
    createdAt
    userId
    entity
    accountId
    type
    transactionDate
    sybmol
    shares
    price
    commission
    updatedAt
  }
}` as Query<MutationUpdateTransactionArgs, UpdateTransactionMutation>;

export const deleteTransaction = `mutation DeleteTransaction($deleteTransactionInput: DeleteTransactionInput!) {
  deleteAggregate(deleteTransactionInput: $deleteTransactionInput) { 
    aggregateId
  }
}` as Query<MutationDeleteTransactionArgs, DeleteTransactionMutation>;

import {
  MutationCreateAccountArgs,
  MutationCreateBankTransactionArgs,
  MutationCreateInvestmentTransactionArgs,
  MutationDeleteAccountArgs,
  MutationDeleteTransactionArgs,
  MutationUpdateAccountArgs,
  MutationUpdateBankTransactionArgs,
  MutationUpdateInvestmentTransactionArgs,
} from './codegen/appsync';
import {
  CreateAccountMutation,
  Query,
  DeleteAccountMutation,
  UpdateAccountMutation,
  DeleteTransactionMutation,
  CreateBankTransactionMutation,
  CreateInvestmentTransactionMutation,
  UpdateBankTransactionMutation,
  UpdateInvestmentTransactionMutation,
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
    deleteAccount(accountId: $accountId) { 
      items {
        accountId
        name
        entity
        type
        createdAt
        updatedAt
      }
    }
  }` as Query<MutationDeleteAccountArgs, DeleteAccountMutation>;

export const createBankTransaction = `mutation CreateBankTransaction($input: CreateBankTransactionInput!) {
    createBankTransaction(input: $input) { 
      pk
      createdAt
      entity
      accountId
      transactionDate
      payee
      category
      amount
      updatedAt
    }
  }` as Query<MutationCreateBankTransactionArgs, CreateBankTransactionMutation>;

export const updateBankTransaction = `mutation UpdateBankTransaction($input: UpdateBankTransactionInput!) {
  updateBankTransaction(input: $input) { 
    pk
    createdAt
    entity
    accountId
    transactionDate
    payee
    category
    amount
    updatedAt
  }
}` as Query<MutationUpdateBankTransactionArgs, UpdateBankTransactionMutation>;

export const createInvestmentTransaction = `mutation CreateInvestmentTransaction($input: CreateInvestmentTransactionInput!) {
    createInvestmentTransaction(input: $input) { 
      pk
      createdAt
      entity
      accountId
      type
      transactionDate
      symbol
      shares
      price
      commission
      updatedAt
    }
  }` as Query<MutationCreateInvestmentTransactionArgs, CreateInvestmentTransactionMutation>;

export const updateInvestmentTransaction = `mutation UpdateInvestmentTransaction($input: UpdateInvestmentTransactionInput!) {
  updateInvestmentTransaction(input: $input) { 
    pk
    createdAt
    entity
    accountId
    transactionDate
    type
    symbol
    shares
    price
    commission
    updatedAt
  }
}` as Query<MutationUpdateInvestmentTransactionArgs, UpdateInvestmentTransactionMutation>;

export const deleteTransaction = `mutation DeleteTransaction($input: DeleteTransactionInput!) {
  deleteAggregate(deleteTransactionInput: $input) { 
    aggregateId
  }
}` as Query<MutationDeleteTransactionArgs, DeleteTransactionMutation>;

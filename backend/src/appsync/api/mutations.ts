import {
  MutationCreateAccountArgs,
  MutationCreateBankTransactionArgs,
  MutationCreateCategoryArgs,
  MutationCreateInvestmentTransactionArgs,
  MutationCreatePayeeArgs,
  MutationCreateSymbolArgs,
  MutationDeleteAccountArgs,
  MutationDeleteTransactionArgs,
  MutationUpdateAccountArgs,
  MutationUpdateBankTransactionArgs,
  MutationUpdateCategoryArgs,
  MutationUpdateInvestmentTransactionArgs,
  MutationUpdatePayeeArgs,
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
  CreateCategoryMutation,
  CreatePayeeMutation,
  CreateSymbolMutation,
  UpdatePayeeMutation,
} from './types';

export const createAccount = `mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) { 
      accountId
      name
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
      type
      entity
      createdAt
      updatedAt
    }
  }` as Query<MutationUpdateAccountArgs, UpdateAccountMutation>;

export const deleteAccount = `mutation DeleteAccount($accountId: String!) {
    deleteAccount(accountId: $accountId) { 
      items {
        accountId
        name
        type
        entity
        createdAt
        updatedAt
      }
    }
  }` as Query<MutationDeleteAccountArgs, DeleteAccountMutation>;

export const createBankTransaction = `mutation CreateBankTransaction($input: CreateBankTransactionInput!) {
    createBankTransaction(input: $input) { 
      transactionId
      accountId
      transactionDate
      payee
      category
      amount
      createdAt
      updatedAt
    }
  }` as Query<MutationCreateBankTransactionArgs, CreateBankTransactionMutation>;

export const updateBankTransaction = `mutation UpdateBankTransaction($input: UpdateBankTransactionInput!) {
  updateBankTransaction(input: $input) { 
    transactionId
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
    transactionId
    accountId
    transactionDate
    type
    symbol
    shares
    price
    commission
    createdAt
    updatedAt
  }
}` as Query<MutationCreateInvestmentTransactionArgs, CreateInvestmentTransactionMutation>;

export const updateInvestmentTransaction = `mutation UpdateInvestmentTransaction($input: UpdateInvestmentTransactionInput!) {
  updateInvestmentTransaction(input: $input) { 
    transactionId
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
  deleteTransaction(input: $input) { 
    aggregateId
  }
}` as Query<MutationDeleteTransactionArgs, DeleteTransactionMutation>;

export const createCategory = `mutation CreateCategory($name: String!) {
  createCategory(name: $name) { 
    pk
    name
    createdAt
    updatedAt
  }
}` as Query<MutationCreateCategoryArgs, CreateCategoryMutation>;

export const updateCategory = `mutation UpdateCategory($name: String!, $pk: String!) {
  updateCategory(name: $name, pk: $pk) { 
    pk
    name
    updatedAt
  }
}` as Query<MutationUpdateCategoryArgs, UpdateAccountMutation>;

export const createPayee = `mutation CreatePayee($name: String!) {
  createPayee(name: $name) { 
    pk
    name
    createdAt
    updatedAt
  }
}` as Query<MutationCreatePayeeArgs, CreatePayeeMutation>;

export const updatePayee = `mutation UpdatePayee($name: String!, $pk: String!) {
  updatePayee(name: $name, pk: $pk) { 
    pk
    name
    updatedAt
  }
}` as Query<MutationUpdatePayeeArgs, UpdatePayeeMutation>;

export const createSymbol = `mutation CreateSymbol($name: String!) {
  createSymbol(name: $name) { 
    pk
    name
    createdAt
    updatedAt
  }
}` as Query<MutationCreateSymbolArgs, CreateSymbolMutation>;

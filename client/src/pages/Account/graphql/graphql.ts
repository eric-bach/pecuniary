import { gql } from '@apollo/client';

export const GET_ACCOUNTS = gql`
  query GetAccounts($userId: String!) {
    getAccounts(userId: $userId) {
      userId
      aggregateId
      type
      name
      description
      createdAt
    }
  }
`;

export const GET_POSITIONS = gql`
  query GetPositions($userId: String!, $aggregateId: String!) {
    getPositions(userId: $userId, aggregateId: $aggregateId) {
      userId
      aggregateId
      symbol
      exchange
      currency
      symbol
      shares
      acb
      bookValue
      marketValue
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($userId: String!, $aggregateId: String!) {
    getTransactions(userId: $userId, aggregateId: $aggregateId) {
      userId
      aggregateId
      createdAt
      type
      transactionDate
      symbol
      shares
      price
      commission
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(createAccountInput: $createAccountInput) {
      userId
      aggregateId
      entity
      type
      name
      description
      createdAt
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($updateAccountInput: UpdateAccountInput!) {
    updateAccount(updateAccountInput: $updateAccountInput) {
      userId
      aggregateId
      entity
      type
      name
      description
      createdAt
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($deleteAccountInput: DeleteAccountInput!) {
    deleteAccount(deleteAccountInput: $deleteAccountInput) {
      userId
      aggregateId
    }
  }
`;

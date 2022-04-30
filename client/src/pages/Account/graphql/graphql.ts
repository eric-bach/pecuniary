import { gql } from '@apollo/client';

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
      sk
      type
      name
      description
      updatedAt
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

export const GET_ACCOUNTS = gql`
  query GetAccounts($userId: String!) {
    getAccounts(userId: $userId) {
      userId
      sk
      aggregateId
      type
      name
      description
      currencies {
        currency
        bookValue
        marketValue
      }
    }
  }
`;

export const GET_POSITIONS = gql`
  query GetPositions($userId: String!, $aggregateId: String!) {
    getPositions(userId: $userId, aggregateId: $aggregateId) {
      userId
      sk
      aggregateId
      symbol
      description
      exchange
      currency
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
      sk
      aggregateId
      type
      transactionDate
      symbol
      shares
      price
      commission
    }
  }
`;

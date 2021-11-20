import { gql } from '@apollo/client';

export const LIST_ACCOUNT_TYPES = gql`
  query ListAccountTypes {
    listAccountTypes {
      id
      name
      description
    }
  }
`;

export const GET_ACCOUNT_BY_USER = gql`
  query getAccountsByUser($userId: String!) {
    getAccountsByUser(userId: $userId) {
      id
      aggregateId
      version
      name
      description
      bookValue
      marketValue
      userId
      createdAt
      updatedAt
      accountType {
        id
        name
        description
      }
    }
  }
`;

export const GET_POSITIONS_BY_ACCOUNT = gql`
  query getPositionsByAccountId($accountId: ID!) {
    getPositionsByAccountId(accountId: $accountId) {
      id
      aggregateId
      version
      symbol
      exchange
      country
      name
      description
      shares
      acb
      bookValue
      marketValue
    }
  }
`;

export const GET_TRANSACTIONS_BY_ACCOUNT = gql`
  query getTransactionsByAccountId($accountId: ID!) {
    getTransactionsByAccountId(accountId: $accountId) {
      id
      aggregateId
      version
      transactionDate
      transactionType {
        id
        name
        description
      }
      symbol
      shares
      price
      commission
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($createAccountInput: CreateEventInput!) {
    createEvent(event: $createAccountInput) {
      id
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($updateAccountInput: CreateEventInput!) {
    createEvent(event: $updateAccountInput) {
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($deleteAccountInput: CreateEventInput!) {
    createEvent(event: $deleteAccountInput) {
      id
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

// TODO Update schema to include parameter to filter by name and userId
export const ACCOUNT_SUBSCRIPTION = gql`
  subscription OnCreateEvent {
    onCreateEvent {
      id
      name
      aggregateId
      version
      data
      userId
      createdAt
    }
  }
`;

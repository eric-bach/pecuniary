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

export const GET_ACCOUNT = gql`
  query GetAccounts($userId: String!, $aggregateId: String!) {
    getAccounts(userId: $userId, aggregateId: $aggregateId) {
      items {
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
  }
`;

export const GET_ACCOUNTS = gql`
  query GetAccounts($userId: String!, $lastEvaluatedKey: LastEvaluatedKey) {
    getAccounts(userId: $userId, lastEvaluatedKey: $lastEvaluatedKey) {
      items {
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
      lastEvaluatedKey {
        userId
        sk
      }
    }
  }
`;

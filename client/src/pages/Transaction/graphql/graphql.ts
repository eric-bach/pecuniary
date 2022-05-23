import { gql } from '@apollo/client';

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($createTransactionInput: CreateTransactionInput!) {
    createTransaction(createTransactionInput: $createTransactionInput) {
      userId
      sk
      aggregateId
      entity
      symbol
      shares
      price
      commission
      createdAt
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($updateTransactionInput: UpdateTransactionInput!) {
    updateTransaction(updateTransactionInput: $updateTransactionInput) {
      userId
      aggregateId
      entity
      symbol
      shares
      price
      commission
      createdAt
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($deleteTransactionInput: DeleteTransactionInput!) {
    deleteTransaction(deleteTransactionInput: $deleteTransactionInput) {
      aggregateId
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($userId: String!, $aggregateId: String!, $lastEvaluatedKey: LastEvaluatedKey) {
    getTransactions(userId: $userId, aggregateId: $aggregateId, lastEvaluatedKey: $lastEvaluatedKey) {
      items {
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
      lastEvaluatedKey {
        userId
        sk
        aggregateId
        transactionDate
      }
    }
  }
`;

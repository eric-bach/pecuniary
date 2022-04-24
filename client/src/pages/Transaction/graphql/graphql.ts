import { gql } from '@apollo/client';

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($createTransactionInput: CreateTransactionInput!) {
    createTransaction(createTransactionInput: $createTransactionInput) {
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

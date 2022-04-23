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

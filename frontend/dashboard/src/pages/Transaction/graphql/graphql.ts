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

export const GET_TRANSACTIONS = gql`
  query GetTransactions($userId: String!, $aggregateId: String!, $lastEvaluatedKey: TransactionLastEvaluatedKey) {
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

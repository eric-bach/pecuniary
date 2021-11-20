import { gql } from '@apollo/client';

export const LIST_TRANSACTION_TYPES = gql`
  query ListTransactionTypes {
    listTransactionTypes {
      id
      name
      description
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($createTransactionInput: CreateEventInput!) {
    createEvent(event: $createTransactionInput) {
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

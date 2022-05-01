import { gql } from '@apollo/client';

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

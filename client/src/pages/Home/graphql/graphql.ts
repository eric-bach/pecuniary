import { gql } from '@apollo/client';

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

import { gql } from '@apollo/client';

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

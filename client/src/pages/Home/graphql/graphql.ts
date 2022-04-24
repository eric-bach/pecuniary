import { gql } from '@apollo/client';

export const GET_ALL_POSITIONS = gql`
  query GetAllPositions($userId: String!) {
    getAllPositions(userId: $userId) {
      userId
      aggregateId
      symbol
      currency
      shares
      marketValue
      bookValue
    }
  }
`;

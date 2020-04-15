/* eslint-disable */

export const listAccountReadModels = `query ListAccountReadModels(
    $filter: ModelAccountReadModelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccountReadModels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        aggregateId
        version
        userId
        name
        description
        bookValue
        marketValue
        createdAt
        updatedAt
        accountType {
          id
          name
          description
        }
        transactions {
          items {
            id
            aggregateId
            version
            userId
            transactionDate
            shares
            price
            commission
            symbol
            createdAt
            updatedAt
            transactionType {
              id
              name
            }
          }
        }
        positions {
          items {
            id
            aggregateId
            version
            userId
            symbol
            shares
            acb
            bookValue
            marketValue
            type
            region
            createdAt
            updatedAt
          }
        }
      }
      nextToken
    }
  }`;

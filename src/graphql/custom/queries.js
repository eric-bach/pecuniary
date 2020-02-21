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
        createdDate
        accountType {
          id
          name
          description
        }
        transactions {
          items {
            id
            aggregateId
            transactionType {
              id
              name
            }
            userId
            transactionDate
            shares
            price
            commission
            symbol
            createdDate
          }
        }
      }
      nextToken
    }
  }`;

// GraphQL queries for the application
export const getAccounts = `query GetAccounts($lastEvaluatedKey: String) {
  getAccounts(lastEvaluatedKey: $lastEvaluatedKey) { 
    items {
      accountId
      name
      category
      type
      balance
      bookValue
      marketValue
      createdAt
      updatedAt
    }
    nextToken
  }
}`;

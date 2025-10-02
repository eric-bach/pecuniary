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

// GraphQL mutations for the application
export const updateAccount = `mutation UpdateAccount($input: UpdateAccountInput!) {
  updateAccount(input: $input) {
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
}`;

export const deleteAccount = `mutation DeleteAccount($accountId: String!) {
  deleteAccount(accountId: $accountId) {
    items {
      accountId
      name
    }
  }
}`;

export const createAccount = `mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
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
}`;

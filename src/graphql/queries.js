/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = `query GetAccount($id: ID!) {
  getAccount(id: $id) {
    id
    name
    description
    accountType {
      id
      name
      description
      accounts {
        nextToken
      }
    }
  }
}
`;
export const listAccounts = `query ListAccounts(
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      accountType {
        id
        name
        description
      }
    }
    nextToken
  }
}
`;
export const getAccountType = `query GetAccountType($id: ID!) {
  getAccountType(id: $id) {
    id
    name
    description
    accounts {
      items {
        id
        name
        description
      }
      nextToken
    }
  }
}
`;
export const listAccountTypes = `query ListAccountTypes(
  $filter: ModelAccountTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccountTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      accounts {
        nextToken
      }
    }
    nextToken
  }
}
`;

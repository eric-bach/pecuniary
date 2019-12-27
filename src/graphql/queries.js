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
    transactions {
      items {
        id
        shares
        price
        commission
      }
      nextToken
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
      transactions {
        nextToken
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
export const getSecurity = `query GetSecurity($id: ID!) {
  getSecurity(id: $id) {
    id
    name
    description
    transactions {
      items {
        id
        shares
        price
        commission
      }
      nextToken
    }
  }
}
`;
export const listSecuritys = `query ListSecuritys(
  $filter: ModelSecurityFilterInput
  $limit: Int
  $nextToken: String
) {
  listSecuritys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      transactions {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getTransaction = `query GetTransaction($id: ID!) {
  getTransaction(id: $id) {
    id
    shares
    price
    commission
    security {
      id
      name
      description
      transactions {
        nextToken
      }
    }
    account {
      id
      name
      description
      accountType {
        id
        name
        description
      }
      transactions {
        nextToken
      }
    }
  }
}
`;
export const listTransactions = `query ListTransactions(
  $filter: ModelTransactionFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      shares
      price
      commission
      security {
        id
        name
        description
      }
      account {
        id
        name
        description
      }
    }
    nextToken
  }
}
`;

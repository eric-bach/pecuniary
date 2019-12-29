/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = `query GetAccount($id: ID!) {
  getAccount(id: $id) {
    id
    userId
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
        transactionDate
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
      userId
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
export const getSecurity = `query GetSecurity($id: ID!) {
  getSecurity(id: $id) {
    id
    name
    description
    transactions {
      items {
        id
        transactionDate
        shares
        price
        commission
      }
      nextToken
    }
    exchangeType {
      id
      name
      description
      currencyType {
        id
        name
        description
      }
      securitys {
        nextToken
      }
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
      exchangeType {
        id
        name
        description
      }
    }
    nextToken
  }
}
`;
export const getTransaction = `query GetTransaction($id: ID!) {
  getTransaction(id: $id) {
    id
    transactionDate
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
      exchangeType {
        id
        name
        description
      }
    }
    account {
      id
      userId
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
    transactionType {
      id
      name
      description
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
      transactionDate
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
        userId
        name
        description
      }
      transactionType {
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
        userId
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
export const getTransactionType = `query GetTransactionType($id: ID!) {
  getTransactionType(id: $id) {
    id
    name
    description
    transactions {
      items {
        id
        transactionDate
        shares
        price
        commission
      }
      nextToken
    }
  }
}
`;
export const listTransactionTypes = `query ListTransactionTypes(
  $filter: ModelTransactionTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactionTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getCurrencyType = `query GetCurrencyType($id: ID!) {
  getCurrencyType(id: $id) {
    id
    name
    description
    exchangeTypes {
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
export const listCurrencyTypes = `query ListCurrencyTypes(
  $filter: ModelCurrencyTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listCurrencyTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      exchangeTypes {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getExchangeType = `query GetExchangeType($id: ID!) {
  getExchangeType(id: $id) {
    id
    name
    description
    currencyType {
      id
      name
      description
      exchangeTypes {
        nextToken
      }
    }
    securitys {
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
export const listExchangeTypes = `query ListExchangeTypes(
  $filter: ModelExchangeTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listExchangeTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      currencyType {
        id
        name
        description
      }
      securitys {
        nextToken
      }
    }
    nextToken
  }
}
`;

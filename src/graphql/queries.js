/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEvent = `query GetEvent($id: ID!) {
  getEvent(id: $id) {
    id
    aggregateId
    name
    version
    data
    userId
    timestamp
  }
}
`;
export const listEvents = `query ListEvents(
  $filter: ModelEventFilterInput
  $limit: Int
  $nextToken: String
) {
  listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      aggregateId
      name
      version
      data
      userId
      timestamp
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
        aggregateId
        version
        userId
        name
        description
        createdDate
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
        aggregateId
        version
        userId
        transactionDate
        shares
        price
        commission
        symbol
        createdDate
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
    }
    nextToken
  }
}
`;
export const getAccountReadModel = `query GetAccountReadModel($id: ID!) {
  getAccountReadModel(id: $id) {
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
      accounts {
        nextToken
      }
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
        createdDate
      }
      nextToken
    }
  }
}
`;
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
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getTransactionReadModel = `query GetTransactionReadModel($id: ID!) {
  getTransactionReadModel(id: $id) {
    id
    aggregateId
    version
    userId
    transactionDate
    shares
    price
    commission
    symbol
    createdDate
    account {
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
export const listTransactionReadModels = `query ListTransactionReadModels(
  $filter: ModelTransactionReadModelFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactionReadModels(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
      createdDate
      account {
        id
        aggregateId
        version
        userId
        name
        description
        createdDate
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

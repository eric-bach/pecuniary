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
    createdAt
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
      createdAt
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
        bookValue
        marketValue
        createdAt
        updatedAt
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
        createdAt
        updatedAt
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
    bookValue
    marketValue
    createdAt
    updatedAt
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
        createdAt
        updatedAt
      }
      nextToken
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
        createdAt
        updatedAt
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
        nextToken
      }
      positions {
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
    createdAt
    updatedAt
    account {
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
        nextToken
      }
      positions {
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
      createdAt
      updatedAt
      account {
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
export const getPositionReadModel = `query GetPositionReadModel($id: ID!) {
  getPositionReadModel(id: $id) {
    id
    aggregateId
    version
    userId
    symbol
    shares
    acb
    bookValue
    createdAt
    updatedAt
    account {
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
        nextToken
      }
      positions {
        nextToken
      }
    }
  }
}
`;
export const listPositionReadModels = `query ListPositionReadModels(
  $filter: ModelPositionReadModelFilterInput
  $limit: Int
  $nextToken: String
) {
  listPositionReadModels(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      aggregateId
      version
      userId
      symbol
      shares
      acb
      bookValue
      createdAt
      updatedAt
      account {
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
      }
    }
    nextToken
  }
}
`;
export const getTimeSeries = `query GetTimeSeries($id: ID!) {
  getTimeSeries(id: $id) {
    id
    symbol
    date
    open
    high
    low
    close
    volume
  }
}
`;
export const listTimeSeriess = `query ListTimeSeriess(
  $filter: ModelTimeSeriesFilterInput
  $limit: Int
  $nextToken: String
) {
  listTimeSeriess(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      symbol
      date
      open
      high
      low
      close
      volume
    }
    nextToken
  }
}
`;

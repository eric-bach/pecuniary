/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = `subscription OnCreateEvent {
  onCreateEvent {
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
export const onUpdateEvent = `subscription OnUpdateEvent {
  onUpdateEvent {
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
export const onDeleteEvent = `subscription OnDeleteEvent {
  onDeleteEvent {
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
export const onCreateAccountType = `subscription OnCreateAccountType {
  onCreateAccountType {
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
export const onUpdateAccountType = `subscription OnUpdateAccountType {
  onUpdateAccountType {
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
export const onDeleteAccountType = `subscription OnDeleteAccountType {
  onDeleteAccountType {
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
export const onCreateTransactionType = `subscription OnCreateTransactionType {
  onCreateTransactionType {
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
export const onUpdateTransactionType = `subscription OnUpdateTransactionType {
  onUpdateTransactionType {
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
export const onDeleteTransactionType = `subscription OnDeleteTransactionType {
  onDeleteTransactionType {
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
export const onCreateCurrencyType = `subscription OnCreateCurrencyType {
  onCreateCurrencyType {
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
export const onUpdateCurrencyType = `subscription OnUpdateCurrencyType {
  onUpdateCurrencyType {
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
export const onDeleteCurrencyType = `subscription OnDeleteCurrencyType {
  onDeleteCurrencyType {
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
export const onCreateExchangeType = `subscription OnCreateExchangeType {
  onCreateExchangeType {
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
export const onUpdateExchangeType = `subscription OnUpdateExchangeType {
  onUpdateExchangeType {
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
export const onDeleteExchangeType = `subscription OnDeleteExchangeType {
  onDeleteExchangeType {
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
export const onCreateAccountReadModel = `subscription OnCreateAccountReadModel {
  onCreateAccountReadModel {
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
        marketValue
        type
        region
        createdAt
        updatedAt
      }
      nextToken
    }
  }
}
`;
export const onUpdateAccountReadModel = `subscription OnUpdateAccountReadModel {
  onUpdateAccountReadModel {
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
        marketValue
        type
        region
        createdAt
        updatedAt
      }
      nextToken
    }
  }
}
`;
export const onDeleteAccountReadModel = `subscription OnDeleteAccountReadModel {
  onDeleteAccountReadModel {
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
        marketValue
        type
        region
        createdAt
        updatedAt
      }
      nextToken
    }
  }
}
`;
export const onCreateTransactionReadModel = `subscription OnCreateTransactionReadModel {
  onCreateTransactionReadModel {
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
export const onUpdateTransactionReadModel = `subscription OnUpdateTransactionReadModel {
  onUpdateTransactionReadModel {
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
export const onDeleteTransactionReadModel = `subscription OnDeleteTransactionReadModel {
  onDeleteTransactionReadModel {
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
export const onCreatePositionReadModel = `subscription OnCreatePositionReadModel {
  onCreatePositionReadModel {
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
export const onUpdatePositionReadModel = `subscription OnUpdatePositionReadModel {
  onUpdatePositionReadModel {
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
export const onDeletePositionReadModel = `subscription OnDeletePositionReadModel {
  onDeletePositionReadModel {
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
export const onCreateTimeSeries = `subscription OnCreateTimeSeries {
  onCreateTimeSeries {
    id
    symbol
    name
    type
    region
    currency
    date
    open
    high
    low
    close
    volume
  }
}
`;
export const onUpdateTimeSeries = `subscription OnUpdateTimeSeries {
  onUpdateTimeSeries {
    id
    symbol
    name
    type
    region
    currency
    date
    open
    high
    low
    close
    volume
  }
}
`;
export const onDeleteTimeSeries = `subscription OnDeleteTimeSeries {
  onDeleteTimeSeries {
    id
    symbol
    name
    type
    region
    currency
    date
    open
    high
    low
    close
    volume
  }
}
`;

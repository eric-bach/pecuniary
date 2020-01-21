/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEvent = `mutation CreateEvent(
  $input: CreateEventInput!
  $condition: ModelEventConditionInput
) {
  createEvent(input: $input, condition: $condition) {
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
export const updateEvent = `mutation UpdateEvent(
  $input: UpdateEventInput!
  $condition: ModelEventConditionInput
) {
  updateEvent(input: $input, condition: $condition) {
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
export const deleteEvent = `mutation DeleteEvent(
  $input: DeleteEventInput!
  $condition: ModelEventConditionInput
) {
  deleteEvent(input: $input, condition: $condition) {
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
export const createAccountType = `mutation CreateAccountType(
  $input: CreateAccountTypeInput!
  $condition: ModelAccountTypeConditionInput
) {
  createAccountType(input: $input, condition: $condition) {
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
export const updateAccountType = `mutation UpdateAccountType(
  $input: UpdateAccountTypeInput!
  $condition: ModelAccountTypeConditionInput
) {
  updateAccountType(input: $input, condition: $condition) {
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
export const deleteAccountType = `mutation DeleteAccountType(
  $input: DeleteAccountTypeInput!
  $condition: ModelAccountTypeConditionInput
) {
  deleteAccountType(input: $input, condition: $condition) {
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
export const createTransactionType = `mutation CreateTransactionType(
  $input: CreateTransactionTypeInput!
  $condition: ModelTransactionTypeConditionInput
) {
  createTransactionType(input: $input, condition: $condition) {
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
export const updateTransactionType = `mutation UpdateTransactionType(
  $input: UpdateTransactionTypeInput!
  $condition: ModelTransactionTypeConditionInput
) {
  updateTransactionType(input: $input, condition: $condition) {
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
export const deleteTransactionType = `mutation DeleteTransactionType(
  $input: DeleteTransactionTypeInput!
  $condition: ModelTransactionTypeConditionInput
) {
  deleteTransactionType(input: $input, condition: $condition) {
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
export const createCurrencyType = `mutation CreateCurrencyType(
  $input: CreateCurrencyTypeInput!
  $condition: ModelCurrencyTypeConditionInput
) {
  createCurrencyType(input: $input, condition: $condition) {
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
export const updateCurrencyType = `mutation UpdateCurrencyType(
  $input: UpdateCurrencyTypeInput!
  $condition: ModelCurrencyTypeConditionInput
) {
  updateCurrencyType(input: $input, condition: $condition) {
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
export const deleteCurrencyType = `mutation DeleteCurrencyType(
  $input: DeleteCurrencyTypeInput!
  $condition: ModelCurrencyTypeConditionInput
) {
  deleteCurrencyType(input: $input, condition: $condition) {
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
export const createExchangeType = `mutation CreateExchangeType(
  $input: CreateExchangeTypeInput!
  $condition: ModelExchangeTypeConditionInput
) {
  createExchangeType(input: $input, condition: $condition) {
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
export const updateExchangeType = `mutation UpdateExchangeType(
  $input: UpdateExchangeTypeInput!
  $condition: ModelExchangeTypeConditionInput
) {
  updateExchangeType(input: $input, condition: $condition) {
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
export const deleteExchangeType = `mutation DeleteExchangeType(
  $input: DeleteExchangeTypeInput!
  $condition: ModelExchangeTypeConditionInput
) {
  deleteExchangeType(input: $input, condition: $condition) {
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
export const createAccountReadModel = `mutation CreateAccountReadModel(
  $input: CreateAccountReadModelInput!
  $condition: ModelAccountReadModelConditionInput
) {
  createAccountReadModel(input: $input, condition: $condition) {
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
export const updateAccountReadModel = `mutation UpdateAccountReadModel(
  $input: UpdateAccountReadModelInput!
  $condition: ModelAccountReadModelConditionInput
) {
  updateAccountReadModel(input: $input, condition: $condition) {
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
export const deleteAccountReadModel = `mutation DeleteAccountReadModel(
  $input: DeleteAccountReadModelInput!
  $condition: ModelAccountReadModelConditionInput
) {
  deleteAccountReadModel(input: $input, condition: $condition) {
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
export const createTransactionReadModel = `mutation CreateTransactionReadModel(
  $input: CreateTransactionReadModelInput!
  $condition: ModelTransactionReadModelConditionInput
) {
  createTransactionReadModel(input: $input, condition: $condition) {
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
export const updateTransactionReadModel = `mutation UpdateTransactionReadModel(
  $input: UpdateTransactionReadModelInput!
  $condition: ModelTransactionReadModelConditionInput
) {
  updateTransactionReadModel(input: $input, condition: $condition) {
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
export const deleteTransactionReadModel = `mutation DeleteTransactionReadModel(
  $input: DeleteTransactionReadModelInput!
  $condition: ModelTransactionReadModelConditionInput
) {
  deleteTransactionReadModel(input: $input, condition: $condition) {
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

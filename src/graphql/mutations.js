/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAccount = `mutation CreateAccount(
  $input: CreateAccountInput!
  $condition: ModelAccountConditionInput
) {
  createAccount(input: $input, condition: $condition) {
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
export const updateAccount = `mutation UpdateAccount(
  $input: UpdateAccountInput!
  $condition: ModelAccountConditionInput
) {
  updateAccount(input: $input, condition: $condition) {
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
export const deleteAccount = `mutation DeleteAccount(
  $input: DeleteAccountInput!
  $condition: ModelAccountConditionInput
) {
  deleteAccount(input: $input, condition: $condition) {
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
export const createSecurity = `mutation CreateSecurity(
  $input: CreateSecurityInput!
  $condition: ModelSecurityConditionInput
) {
  createSecurity(input: $input, condition: $condition) {
    id
    name
    description
    userId
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
      securities {
        nextToken
      }
    }
  }
}
`;
export const updateSecurity = `mutation UpdateSecurity(
  $input: UpdateSecurityInput!
  $condition: ModelSecurityConditionInput
) {
  updateSecurity(input: $input, condition: $condition) {
    id
    name
    description
    userId
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
      securities {
        nextToken
      }
    }
  }
}
`;
export const deleteSecurity = `mutation DeleteSecurity(
  $input: DeleteSecurityInput!
  $condition: ModelSecurityConditionInput
) {
  deleteSecurity(input: $input, condition: $condition) {
    id
    name
    description
    userId
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
      securities {
        nextToken
      }
    }
  }
}
`;
export const createTransaction = `mutation CreateTransaction(
  $input: CreateTransactionInput!
  $condition: ModelTransactionConditionInput
) {
  createTransaction(input: $input, condition: $condition) {
    id
    transactionDate
    shares
    price
    commission
    security {
      id
      name
      description
      userId
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
export const updateTransaction = `mutation UpdateTransaction(
  $input: UpdateTransactionInput!
  $condition: ModelTransactionConditionInput
) {
  updateTransaction(input: $input, condition: $condition) {
    id
    transactionDate
    shares
    price
    commission
    security {
      id
      name
      description
      userId
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
export const deleteTransaction = `mutation DeleteTransaction(
  $input: DeleteTransactionInput!
  $condition: ModelTransactionConditionInput
) {
  deleteTransaction(input: $input, condition: $condition) {
    id
    transactionDate
    shares
    price
    commission
    security {
      id
      name
      description
      userId
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
        userId
        name
        description
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
        userId
        name
        description
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
        userId
        name
        description
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
    securities {
      items {
        id
        name
        description
        userId
      }
      nextToken
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
    securities {
      items {
        id
        name
        description
        userId
      }
      nextToken
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
    securities {
      items {
        id
        name
        description
        userId
      }
      nextToken
    }
  }
}
`;

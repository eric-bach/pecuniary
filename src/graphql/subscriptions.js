/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = `subscription OnCreateAccount {
  onCreateAccount {
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
export const onUpdateAccount = `subscription OnUpdateAccount {
  onUpdateAccount {
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
export const onDeleteAccount = `subscription OnDeleteAccount {
  onDeleteAccount {
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
export const onCreateAccountType = `subscription OnCreateAccountType {
  onCreateAccountType {
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
export const onUpdateAccountType = `subscription OnUpdateAccountType {
  onUpdateAccountType {
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
export const onDeleteAccountType = `subscription OnDeleteAccountType {
  onDeleteAccountType {
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
export const onCreateSecurity = `subscription OnCreateSecurity {
  onCreateSecurity {
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
export const onUpdateSecurity = `subscription OnUpdateSecurity {
  onUpdateSecurity {
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
export const onDeleteSecurity = `subscription OnDeleteSecurity {
  onDeleteSecurity {
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
export const onCreateTransaction = `subscription OnCreateTransaction {
  onCreateTransaction {
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
export const onUpdateTransaction = `subscription OnUpdateTransaction {
  onUpdateTransaction {
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
export const onDeleteTransaction = `subscription OnDeleteTransaction {
  onDeleteTransaction {
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
export const onCreateTransactionType = `subscription OnCreateTransactionType {
  onCreateTransactionType {
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
export const onUpdateTransactionType = `subscription OnUpdateTransactionType {
  onUpdateTransactionType {
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
export const onDeleteTransactionType = `subscription OnDeleteTransactionType {
  onDeleteTransactionType {
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

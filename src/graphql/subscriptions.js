/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = `subscription OnCreateAccount {
  onCreateAccount {
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
export const onUpdateAccount = `subscription OnUpdateAccount {
  onUpdateAccount {
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
export const onDeleteAccount = `subscription OnDeleteAccount {
  onDeleteAccount {
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
export const onCreateAccountType = `subscription OnCreateAccountType {
  onCreateAccountType {
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
export const onUpdateAccountType = `subscription OnUpdateAccountType {
  onUpdateAccountType {
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
export const onDeleteAccountType = `subscription OnDeleteAccountType {
  onDeleteAccountType {
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
export const onCreateSecurity = `subscription OnCreateSecurity {
  onCreateSecurity {
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
export const onUpdateSecurity = `subscription OnUpdateSecurity {
  onUpdateSecurity {
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
export const onDeleteSecurity = `subscription OnDeleteSecurity {
  onDeleteSecurity {
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
export const onCreateTransaction = `subscription OnCreateTransaction {
  onCreateTransaction {
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
export const onUpdateTransaction = `subscription OnUpdateTransaction {
  onUpdateTransaction {
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
export const onDeleteTransaction = `subscription OnDeleteTransaction {
  onDeleteTransaction {
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

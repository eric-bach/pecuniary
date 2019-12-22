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

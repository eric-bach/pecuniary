/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAccount = `mutation CreateAccount(
  $input: CreateAccountInput!
  $condition: ModelAccountConditionInput
) {
  createAccount(input: $input, condition: $condition) {
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
export const updateAccount = `mutation UpdateAccount(
  $input: UpdateAccountInput!
  $condition: ModelAccountConditionInput
) {
  updateAccount(input: $input, condition: $condition) {
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
export const deleteAccount = `mutation DeleteAccount(
  $input: DeleteAccountInput!
  $condition: ModelAccountConditionInput
) {
  deleteAccount(input: $input, condition: $condition) {
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
        name
        description
      }
      nextToken
    }
  }
}
`;

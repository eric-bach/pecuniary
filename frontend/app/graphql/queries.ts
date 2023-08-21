export const GET_ACCOUNTS = `query GetAccounts {
    getAccounts {
        pk
        createdAt
        type
        name
        updatedAt      
    }
  }`;

export const CREATE_ACCOUNT = `mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
        pk
        createdAt
        accountId
        entity
        name
        type
        updatedAt
    }
  }`;

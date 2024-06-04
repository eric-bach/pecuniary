import { gql } from '@apollo/client/core';
import { GraphQLResult } from '@aws-amplify/api';
import { Query } from '../api/types';
import { QueryGetAccountArgs, Query as Query2 } from '../api/codegen/appsync';

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    getAccounts {
      accountId
      name
      entity
      type
      createdAt
      updatedAt
    }
  }
`;

export const getAccounts = `query GetAccounts {
  getAccounts { 
    accountId
    name
    entity
    type
    createdAt
    updatedAt
  }
}`;

export const createAccount = `mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) { 
    accountId
    name
    entity
    type
    createdAt
    updatedAt
  }
}`;

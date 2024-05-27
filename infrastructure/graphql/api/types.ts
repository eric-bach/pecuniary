// This is manually created until we have a better way to generate this

import { Account } from './codegen/appsync';

export type Query<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export type GetAccountsQueryVariables = {
  limit?: number | null;
  nextToken?: string | null;
};

export type GetAccountsQuery = {
  getAccounts: Account[];
};

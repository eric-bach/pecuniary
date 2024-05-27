export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AWSDate: { input: string; output: string };
  AWSDateTime: { input: string; output: string };
  AWSEmail: { input: string; output: string };
  AWSIPAddress: { input: string; output: string };
  AWSJSON: { input: string; output: string };
  AWSPhone: { input: string; output: string };
  AWSTime: { input: string; output: string };
  AWSTimestamp: { input: number; output: number };
  AWSURL: { input: string; output: string };
};

export type Account = {
  __typename?: 'Account';
  accountId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  entity: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['String']['output'];
};

export type Aggregates = {
  __typename?: 'Aggregates';
  items?: Maybe<Array<Maybe<Data>>>;
};

export type CreateAccountInput = {
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type Data = {
  __typename?: 'Data';
  acb?: Maybe<Scalars['Float']['output']>;
  accountId: Scalars['ID']['output'];
  amount?: Maybe<Scalars['Float']['output']>;
  bookValue?: Maybe<Scalars['Float']['output']>;
  commission?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  entity: Scalars['String']['output'];
  exchange?: Maybe<Scalars['String']['output']>;
  marketValue?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  payee?: Maybe<Scalars['String']['output']>;
  pk: Scalars['ID']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  shares?: Maybe<Scalars['Float']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  transactionDate?: Maybe<Scalars['AWSDate']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount?: Maybe<Account>;
  deleteAggregate?: Maybe<Aggregates>;
  updateAccount?: Maybe<Account>;
};

export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};

export type MutationDeleteAggregateArgs = {
  accountId: Scalars['String']['input'];
};

export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};

export type Query = {
  __typename?: 'Query';
  getAccount?: Maybe<Account>;
  getAccounts?: Maybe<Array<Maybe<Account>>>;
  getAggregate?: Maybe<Aggregates>;
};

export type QueryGetAccountArgs = {
  accountId: Scalars['String']['input'];
};

export type QueryGetAggregateArgs = {
  accountId: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAccountInput = {
  createdAt: Scalars['String']['input'];
  name: Scalars['String']['input'];
  pk: Scalars['ID']['input'];
  type: Scalars['String']['input'];
};

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDate: { input: string; output: string; }
  AWSDateTime: { input: string; output: string; }
  AWSEmail: { input: string; output: string; }
  AWSIPAddress: { input: string; output: string; }
  AWSJSON: { input: string; output: string; }
  AWSPhone: { input: string; output: string; }
  AWSTime: { input: string; output: string; }
  AWSTimestamp: { input: number; output: number; }
  AWSURL: { input: string; output: string; }
};

export type Account = {
  __typename?: 'Account';
  accountId: Scalars['ID']['output'];
  balance: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
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

export type BankTransaction = {
  __typename?: 'BankTransaction';
  accountId: Scalars['ID']['output'];
  amount: Scalars['Float']['output'];
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  entity: Scalars['String']['output'];
  payee: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
  transactionDate: Scalars['AWSDate']['output'];
  transactionId: Scalars['ID']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['String']['output'];
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['AWSDateTime']['output'];
  entity: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type CreateAccountInput = {
  category: Scalars['String']['input'];
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateBankTransactionInput = {
  accountId: Scalars['ID']['input'];
  amount: Scalars['Float']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  payee: Scalars['String']['input'];
  transactionDate: Scalars['AWSDate']['input'];
};

export type CreateInvestmentTransactionInput = {
  accountId: Scalars['ID']['input'];
  commission: Scalars['Float']['input'];
  price: Scalars['Float']['input'];
  shares: Scalars['Float']['input'];
  symbol: Scalars['String']['input'];
  transactionDate: Scalars['AWSDate']['input'];
  type: Scalars['String']['input'];
};

export type Data = {
  __typename?: 'Data';
  acb?: Maybe<Scalars['Float']['output']>;
  accountId: Scalars['ID']['output'];
  amount?: Maybe<Scalars['Float']['output']>;
  bookValue?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  commission?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
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

export type DeleteBankTransactionInput = {
  pk: Scalars['ID']['input'];
};

export type DeleteInvestmentTransactionInput = {
  pk: Scalars['ID']['input'];
};

export type DeleteTransaction = {
  __typename?: 'DeleteTransaction';
  pk?: Maybe<Scalars['String']['output']>;
};

export type GetAccountsResponse = {
  __typename?: 'GetAccountsResponse';
  items?: Maybe<Array<Maybe<Account>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type GetBankTransactionsResponse = {
  __typename?: 'GetBankTransactionsResponse';
  items?: Maybe<Array<Maybe<BankTransaction>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type GetCategoriesResponse = {
  __typename?: 'GetCategoriesResponse';
  items?: Maybe<Array<Maybe<Category>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type GetInvestmentTransactionsResponse = {
  __typename?: 'GetInvestmentTransactionsResponse';
  items?: Maybe<Array<Maybe<InvestmentTransaction>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type GetPayeesResponse = {
  __typename?: 'GetPayeesResponse';
  items?: Maybe<Array<Maybe<Payee>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type GetPositionsResponse = {
  __typename?: 'GetPositionsResponse';
  items?: Maybe<Array<Maybe<Position>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type GetSymbolsResponse = {
  __typename?: 'GetSymbolsResponse';
  items?: Maybe<Array<Maybe<Symbol>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type InvestmentTransaction = {
  __typename?: 'InvestmentTransaction';
  accountId: Scalars['ID']['output'];
  commission: Scalars['Float']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  entity: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
  price: Scalars['Float']['output'];
  shares: Scalars['Float']['output'];
  symbol: Scalars['String']['output'];
  transactionDate: Scalars['AWSDate']['output'];
  transactionId: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount?: Maybe<Account>;
  createBankTransaction?: Maybe<BankTransaction>;
  createCategory?: Maybe<Category>;
  createInvestmentTransaction?: Maybe<InvestmentTransaction>;
  createPayee?: Maybe<Payee>;
  createSymbol?: Maybe<Symbol>;
  deleteAccount?: Maybe<Aggregates>;
  deleteBankTransaction?: Maybe<DeleteTransaction>;
  deleteInvestmentTransaction?: Maybe<DeleteTransaction>;
  updateAccount?: Maybe<Account>;
  updateBankTransaction?: Maybe<BankTransaction>;
  updateCategory?: Maybe<Category>;
  updateInvestmentTransaction?: Maybe<InvestmentTransaction>;
  updatePayee?: Maybe<Payee>;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateBankTransactionArgs = {
  input: CreateBankTransactionInput;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateInvestmentTransactionArgs = {
  input: CreateInvestmentTransactionInput;
};


export type MutationCreatePayeeArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateSymbolArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteAccountArgs = {
  accountId: Scalars['String']['input'];
};


export type MutationDeleteBankTransactionArgs = {
  input: DeleteBankTransactionInput;
};


export type MutationDeleteInvestmentTransactionArgs = {
  input: DeleteInvestmentTransactionInput;
};


export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


export type MutationUpdateBankTransactionArgs = {
  input: UpdateBankTransactionInput;
};


export type MutationUpdateCategoryArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
};


export type MutationUpdateInvestmentTransactionArgs = {
  input: UpdateInvestmentTransactionInput;
};


export type MutationUpdatePayeeArgs = {
  name: Scalars['String']['input'];
  pk: Scalars['String']['input'];
};

export type Payee = {
  __typename?: 'Payee';
  createdAt: Scalars['AWSDateTime']['output'];
  entity: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type Position = {
  __typename?: 'Position';
  acb: Scalars['Float']['output'];
  accountId: Scalars['ID']['output'];
  bookValue: Scalars['Float']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  entity: Scalars['String']['output'];
  exchange: Scalars['String']['output'];
  marketValue: Scalars['Float']['output'];
  pk: Scalars['ID']['output'];
  postiionId: Scalars['ID']['output'];
  shares: Scalars['Float']['output'];
  symbol: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getAccount?: Maybe<Account>;
  getAccounts?: Maybe<GetAccountsResponse>;
  getAggregate?: Maybe<Aggregates>;
  getBankTransactions?: Maybe<GetBankTransactionsResponse>;
  getCategories?: Maybe<GetCategoriesResponse>;
  getInvestmentTransactions?: Maybe<GetInvestmentTransactionsResponse>;
  getPayees?: Maybe<GetPayeesResponse>;
  getPositions?: Maybe<GetPositionsResponse>;
  getSymbols?: Maybe<GetSymbolsResponse>;
};


export type QueryGetAccountArgs = {
  accountId: Scalars['String']['input'];
};


export type QueryGetAccountsArgs = {
  lastEvaluatedKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAggregateArgs = {
  accountId: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetBankTransactionsArgs = {
  accountId: Scalars['String']['input'];
  lastEvaluatedKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetCategoriesArgs = {
  lastEvaluatedKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetInvestmentTransactionsArgs = {
  accountId: Scalars['String']['input'];
  lastEvaluatedKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetPayeesArgs = {
  lastEvaluatedKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetPositionsArgs = {
  accountId: Scalars['String']['input'];
  lastEvaluatedKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetSymbolsArgs = {
  lastEvaluatedKey?: InputMaybe<Scalars['String']['input']>;
};

export type Symbol = {
  __typename?: 'Symbol';
  createdAt: Scalars['AWSDateTime']['output'];
  entity: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pk: Scalars['ID']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type UpdateAccountInput = {
  accountId: Scalars['ID']['input'];
  category: Scalars['String']['input'];
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type UpdateBankTransactionInput = {
  accountId: Scalars['ID']['input'];
  amount: Scalars['Float']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  payee: Scalars['String']['input'];
  transactionDate: Scalars['AWSDate']['input'];
  transactionId: Scalars['ID']['input'];
};

export type UpdateInvestmentTransactionInput = {
  accountId: Scalars['ID']['input'];
  commission: Scalars['Float']['input'];
  price: Scalars['Float']['input'];
  shares: Scalars['Float']['input'];
  symbol: Scalars['String']['input'];
  transactionDate: Scalars['AWSDate']['input'];
  transactionId: Scalars['ID']['input'];
  type: Scalars['String']['input'];
};

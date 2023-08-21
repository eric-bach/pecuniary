export type Account = {
  pk: string;
  createdAt: string;
  type: string;
  name: string;
  updatedAt: string;
};

// GetAccounts
export type GetAccountsResponse = {
  getAccounts: Account[];
};

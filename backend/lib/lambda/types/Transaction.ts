export type TransactionReadModel = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
  accountId: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  transactionType: {
    id: string;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateTransactionInput = {
  accountId: string;
  aggregateId: string;
  userId: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  transactionTypeId: string;
  transactionTypeName: string;
  transactionTypeDescription: string;
};

export type UpdateTransactionInput = {
  id: string;
  version: number;
  accountId: string;
  aggregateId: string;
  userId: string;
  transactionDate: string;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  transactionTypeId: string;
  transactionTypeName: string;
  transactionTypeDescription: string;
};

export type DeleteTransactionInput = {
  id: string;
  userId: string;
};

export type TransactionAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    accountId: string; //getTransactionsByAccountId, getPositionsByAccountId

    createTransactionInput: CreateTransactionInput;
    updateTransactionInput: UpdateTransactionInput;
    deleteTransactionInput: DeleteTransactionInput;
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

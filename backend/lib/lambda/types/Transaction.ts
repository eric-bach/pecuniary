export type TransactionReadModel = {
  userId: string;
  createdAt: string;
  updatedAt: string;
  aggregateId: string;
  entity: string;
  type: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  exchange: string;
  currency: string;
};

export type CreateTransactionInput = {
  userId: string;
  aggregateId: string;
  type: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  exchange: string;
  currency: string;
};

export type UpdateTransactionInput = {
  userId: string;
  createdAt: string;
  aggregateId: string;
  type: string;
  transactionDate: string;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  exchange: string;
  currency: string;
};

export type DeleteTransactionInput = {
  userId: string;
  createdAt: string;
  aggregateId: string;
  symbol: string;
};

export type TransactionAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    userId: string; //getTransactions
    aggregateId: string; //getTransactions

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

export type TransactionData = {
  id: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  accountId: number;
  transactionType: {
    id: string;
    name: string;
    description: string;
  };
};

export type TransactionReadModel = {
  id: string;
  aggregateId: string;
  version: string;
  userId: string;
  accountId: string;
  transactionDate: string;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  transactionType: {
    id: string;
    name: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTransactionEvent = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  accountId: string;
  transactionType: {
    id: string;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateTransactionInput = {
  createTransactionInput: {
    userId: string;
    aggregateId: string;
    type: string;
    transactionDate: string;
    symbol: string;
    shares: number;
    price: number;
    commission: number;
  };
};

export type TransactionsProps = {
  transactions: [TransactionReadModel];
};

export type TransactionReadModel = {
  userId: string;
  aggregateId: string;
  type: string;
  transactionDate: string;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  createdAt: Date;
};

export type TransactionFormValues = {
  commission: number;
  price: number;
  shares: number;
  symbol: string;
  transactionDate: Date;
  transactionTypeName: string;
};

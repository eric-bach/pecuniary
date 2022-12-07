export type TransactionViewModel = {
  type: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
};

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
  aggregateId: string;
};

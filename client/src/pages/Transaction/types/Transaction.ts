import { Event } from '../../types/Event';

export type CreateTransactionInput = {
  createTransactionInput: Event;
};

export type TransactionsProps = {
  transactions: [TransactionReadModel];
};

export type TransactionReadModel = {
  id: string;
  aggregateId: string;
  version: number;
  transactionDate: string;
  shares: number;
  price: number;
  commission: number;
  symbol: string;
  transactionType: {
    id: string;
    name: string;
    description: string;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionFormValues = {
  commission: number;
  price: number;
  shares: number;
  symbol: string;
  transactionDate: Date;
  transactionTypeName: string;
};

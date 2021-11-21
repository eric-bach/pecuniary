export type PositionReadModel = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
  name: string;
  description: string;
  accountId: string;
  symbol: string;
  exchange: string;
  currency: string;
  country: string;
  shares: number;
  bookValue: number;
  marketValue: number;
  acb: number;
  lastTransactionDate: Date;
};

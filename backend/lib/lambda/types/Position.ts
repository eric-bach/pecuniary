export type PositionReadModel = {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  aggregateId: string;
  entity: string;
  type: string;
  description: string;
  symbol: string;
  exchange: string;
  currency: string;
  shares: number;
  bookValue: number;
  marketValue: number;
  acb: number;
  lastTransactionDate: Date;
};

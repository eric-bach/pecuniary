export type PositionsProps = {
  positions: [PositionReadModel];
};

export type PositionReadModel = {
  userId: string;
  createdAt: Date;
  aggregateId: string;
  symbol: string;
  description: string;
  exchange: string;
  currency: string;
  shares: number;
  acb: number;
  bookValue: number;
  marketValue: number;
};

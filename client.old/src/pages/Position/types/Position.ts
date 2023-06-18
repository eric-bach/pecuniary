export type PositionsProps = {
  aggregateId: string;
};

export type PositionReadModel = {
  userId: string;
  sk: string;
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
export type PositionsProps = {
  positions: [PositionReadModel];
};

export type PositionReadModel = {
  id: string;
  aggregateId: string;
  version: number;
  symbol: string;
  exchange: string;
  country: string;
  name: string;
  description: string;
  shares: number;
  acb: number;
  bookValue: number;
  marketValue: number;
};

export type PositionReadModel = {
  pk: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  entity: string;
  symbol: string;
  description: string;
  exchange: string;
  currency: string;
  shares: number;
  acb: number;
  bookValue: number;
  marketValue: number;
};

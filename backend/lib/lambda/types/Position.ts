export type Position = {
  id: string;
  aggrgateId: string;
  version: number;
  userId: string;
  name: string;
  description: string;
  exchange: string;
  currency: string;
  country: string;
  symbol: string;
  shares: number;
  acb: number;
  bookValue: number;
  marketValue: number;
  lastTransactionDate: Date;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
};

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

export type PositionAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    accountId: string; //getPositionsByAccountId
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

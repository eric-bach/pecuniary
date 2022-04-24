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

export type PositionAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    userId: string; //getPositions
    aggregateId: string; //getPositions
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

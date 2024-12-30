export type PositionReadModel = {
  pk: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  entity: string;
  symbol: string;
  shares: number;
  acb: number;
  bookValue: number;

  description: string;
  exchange: string;
  currency: string;
  marketValue: number;
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

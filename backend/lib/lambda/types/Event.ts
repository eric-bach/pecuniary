export type Aggregate = {
  id: string;
  aggregateId: string;
  version: number;
};

export type EventBridgeDetail = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
  data: string;
};

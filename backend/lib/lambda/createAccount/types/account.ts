export type EventBridgeDetail = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
  data: string;
};

export type CreateAccountData = {
  id: string;
  name: string;
  description: string;
  bookValue: number;
  marketValue: number;
  accountType: {
    id: string;
    name: string;
    description: string;
  };
};

export type CreateEvent = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
  name: string;
  description: string;
  bookValue: number;
  marketValue: number;
  accountType: {
    id: string;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
};

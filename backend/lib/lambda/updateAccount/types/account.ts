export type EventBridgeDetail = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
  data: string;
};

export type UpdateAccountData = {
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

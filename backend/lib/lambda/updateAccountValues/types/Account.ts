export type UpdateAccountValuesData = {
  id: string;
  version: number;
  bookValue: number;
  marketValue: number;
};

export type AccountReadModel = {
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
  createdAt: Date;
  updatedAt: Date;
};

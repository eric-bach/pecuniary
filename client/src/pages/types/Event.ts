export type Event = {
  aggregateId: string;
  name: string;
  data: string;
  version: number;
  userId: string;
  createdAt: Date;
};

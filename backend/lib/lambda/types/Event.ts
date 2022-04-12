type Event = {
  id: string;
  aggrgateId: string;
  name: string;
  version: number;
  data: string;
  userId: string;
  createdAt: Date;
};

export default Event;

export type Aggregate = {
  id: string;
  aggregateId: string;
  version: number;
};

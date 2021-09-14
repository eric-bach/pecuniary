type Position = {
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
  positionReadModelAccountId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default Position;

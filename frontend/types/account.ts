// Type definitions for the frontend
export interface Account {
  accountId: string;
  name: string;
  category: string;
  type?: string;
  balance?: number;
  bookValue?: number;
  marketValue?: number;
  createdAt?: string;
  updatedAt?: string;
}

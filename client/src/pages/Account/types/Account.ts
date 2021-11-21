import { Event } from '../../types/Event';

export type CreateAccountInput = {
  createAccountInput: Event;
};

export type UpdateAccountInput = {
  updateAccountInput: Event;
};

export type DeleteAccountInput = {
  deleteAccountInput: Event;
};

export type AccountProps = {
  location: {
    state: {
      account: AccountReadModel;
    };
  };
};

export type AccountReadModel = {
  id: string;
  aggregateId: string;
  version: number;
  name: string;
  description: string;
  bookValue: number;
  marketValue: number;
  accountType: {
    id: string;
    name: string;
    description: string;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

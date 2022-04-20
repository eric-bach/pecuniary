export type CreateAccountInput = {
  createAccountInput: {
    userId: string;
    type: string;
    name: string;
    description: string;
  };
};

export type UpdateAccountInput = {
  updateAccountInput: {
    userId: string;
    aggregateId: string;
    type: string;
    name: string;
    description: string;
  };
};

export type DeleteAccountInput = {
  deleteAccountInput: {
    userId: string;
    aggregateId: string;
  };
};

export type AccountProps = {
  location: {
    state: {
      account: AccountReadModel;
    };
  };
};

export type AccountReadModel = {
  userId: string;
  aggregateId: string;
  type: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

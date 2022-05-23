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
    sk: string;
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
  sk: string;
  aggregateId: string;
  type: string;
  name: string;
  description: string;
  currencies: [
    {
      currency: string;
      bookValue: number;
      marketValue: number;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionLastEvaluatedKey = {
  userId: string;
  sk: string;
  aggregateId: string;
  transactionDate: string;
};

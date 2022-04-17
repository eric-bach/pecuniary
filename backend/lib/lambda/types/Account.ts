export type AccountReadModel = {
  userId: string;
  aggregateId: string;
  entity: string;
  type: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountInput = {
  userId: string;
  type: string;
  name: string;
  description: string;
};

export type UpdateAccountInput = {
  userId: string;
  aggregateId: string;
  type: string;
  name: string;
  description: string;
};

export type DeleteAccountInput = {
  userId: string;
  aggregateId: string;
};

export type AccountAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    userId: string; //getAccounts

    createAccountInput: CreateAccountInput;
    updateAccountInput: UpdateAccountInput;
    deleteAccountInput: DeleteAccountInput;
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

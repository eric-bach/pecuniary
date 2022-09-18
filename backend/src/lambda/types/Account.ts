export type AccountReadModel = {
  userId: string;
  sk: string;
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
  sk: string;
  type: string;
  name: string;
  description: string;
};

export type DeleteAccountInput = {
  userId: string;
  aggregateId: string;
};

export type LastEvaluatedKey = {
  userId: string;
  sk: string;
};

export type AccountAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    userId: string; //getAccounts
    lastEvaluatedKey: LastEvaluatedKey; //getAccounts

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

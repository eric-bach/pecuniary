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
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountInput = {
  userId: string;
  name: string;
  description: string;
  accountTypeId: string;
  accountTypeName: string;
  accountTypeDescription: string;
};

export type UpdateAccountInput = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
  name: string;
  description: string;
  bookValue: number;
  marketValue: number;
  accountTypeId: string;
  accountTypeName: string;
  accountTypeDescription: string;
};

export type DeleteAccountInput = {
  id: string;
  userId: string;
};

export type AccountAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    userId: string; //getAccountsByUserId
    aggregateId: string; //getAccountByAggregateId

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

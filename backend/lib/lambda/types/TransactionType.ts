export type TransactionTypeReadModel = {
  id: string;
  name: string;
  description: string;
};

export type TransactionTypeAppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {};
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

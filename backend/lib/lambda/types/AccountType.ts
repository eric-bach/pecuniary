export type AccountTypeReadModel = {
  id: string;
  name: string;
  description: string;
};

export type AccountTypeAppSyncEvent = {
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

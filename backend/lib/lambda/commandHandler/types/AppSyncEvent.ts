import Event from './Event';
import Filter from './Filter';
import Position from './Position';

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    input: Position;
    filter: Filter;

    event: Event;
    userId: string; //getAccountsByUserId
    aggregateId: string; //getAccountByAggregateId
    accountId: string; //getTransactionsByAccountId, getPositionsByAccountId
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

export default AppSyncEvent;

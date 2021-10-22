import Event from './Event';
import Filter from './Filter';
import Position from './Position';

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    event: Event;
    input: Position;
    filter: Filter;

    userId: string; //getAccountsByUserId
    aggregateId: string; //getAccountByAggregateId
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

export default AppSyncEvent;

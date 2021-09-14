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
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

export default AppSyncEvent;
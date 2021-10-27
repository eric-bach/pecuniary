import Event from './Event';
import Cognito from './Cognito';
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
    cognito: Cognito; //addUserToCognitoGroup
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

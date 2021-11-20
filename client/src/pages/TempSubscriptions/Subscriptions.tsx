// This component is a demo of a GraphQL subscription. Follow this video to setup another component to subscribe to this components mutation
// - https://www.youtube.com/watch?v=Bf3k7zH0I6w

import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { AccountReadModel } from '../Account/types/Account';

// TODO Set userId to currently logged in userId
const GET_ACCOUNTS = gql`
  query getAccountsByUser {
    getAccountsByUser(userId: "eric") {
      id
      aggregateId
      version
      name
      description
      bookValue
      marketValue
      userId
      createdAt
      updatedAt
      accountType {
        id
        name
        description
      }
    }
  }
`;

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($createAccountInput: CreateEventInput!) {
    createEvent(event: $createAccountInput) {
      id
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

const ACCOUNT_SUBSCRIPTION = gql`
  subscription OnCreateEvent {
    onCreateEvent {
      id
      name
      aggregateId
      version
      data
      userId
      createdAt
    }
  }
`;

const Dummy = () => {
  const { subscribeToMore, loading: listLoading, data: listData, error: listError, refetch } = useQuery(GET_ACCOUNTS);
  const [createAccountMutateFunction, { error: createError }] = useMutation(CREATE_ACCOUNT);
  const { data: subData, error: subError } = useSubscription(ACCOUNT_SUBSCRIPTION);

  useEffect(() => {
    if (listData && listData.getAccountsByUser && subData) {
      console.log('[SUBSCRIPTIONS] New event created: ', subData);
    }
  }, [subData, listData]);

  if (listError || createError || subError) {
    console.error(listError);
    console.error(createError);
    console.error(subError);
    return <div>'Error!'</div>; // You probably want to do more here!
  }
  if (listLoading) return <div>'loading...'</div>; // You can also show a spinner here.

  const createAccountInput = {
    createAccountInput: {
      aggregateId: uuidv4(),
      name: 'AccountCreatedEvent',
      data: `{"name":"test","description":"description","bookValue":15,"marketValue":0,"accountType":{"id":"1","name":"TFSA","description":"Tax Free Savings Account"}}`,
      version: 1,
      // TODO Set userId to currently logged in userId
      userId: 'eric',
      createdAt: new Date(),
    },
  };

  const handleClick = () => {
    console.log('[SUBSCRIPTIONS] Creating account');

    createAccountMutateFunction({
      variables: createAccountInput,
    })
      .then((res) => {
        console.log('[SUBSCRIPTIONS] Account created successfully');
        //window.location.pathname = '/accounts';
        //window.location.pathname = '/parent';
      })
      .catch((err) => {
        console.error('[SUBSCRIPTIONS] Error occurred creating account');
        console.error(err);
      });
  };

  const handleRefresh = () => {
    console.log('[SUBSCRIPTIONS] Refreshing Account list');

    refetch();
  };

  return (
    <div>
      <h1>Accounts: {listData.getAccountsByUser.length}</h1>
      {listData.getAccountsByUser.map((d: AccountReadModel) => {
        return <div key={d.id}>{d.id}</div>;
      })}
      <h3>New Account: {JSON.stringify(subData)}</h3>
      {subscribeToMore({
        document: ACCOUNT_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data.onCreateEvent) return prev;

          const newEvent = subscriptionData.data.onCreateEvent;

          console.log('[SUBSCRIPTIONS] Subscription triggered: ', newEvent);

          var data = JSON.parse(newEvent.data);
          return Object.assign({}, prev, {
            getAccountsByUser: {
              id: newEvent.id, // TODO This is the event id, not the account id
              aggregateId: newEvent.aggregateId,
              version: newEvent.version,
              userId: newEvent.userId,
              createdAt: newEvent.createdAt,
              updatedAt: newEvent.createdAt,
              name: data.name,
              description: data.description,
              bookValue: data.bookValue,
              marketValue: data.marketValue,
              accountType: data.accountType,
            },
            ...prev,
          });
        },
      })}
      <button onClick={() => handleClick()}>Submit</button>
      <button onClick={() => handleRefresh()}>Refresh</button>
    </div>
  );
};

export default Dummy;

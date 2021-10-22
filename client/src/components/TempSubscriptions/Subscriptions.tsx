import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import AccountReadModel from '../Account/types/Account';
import SubscriptionsParent from './SubscriptionsParent';

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
const createAccountInput = {
  createAccountInput: {
    aggregateId: uuidv4(),
    name: 'AccountCreatedEvent',
    data: `{"name":"test","description":"description","bookValue":15,"marketValue":0,"accountType":{"id":"1","name":"TFSA","description":"Tax Free Savings Account"}}`,
    version: 1,
    userId: 'eric',
    createdAt: new Date(),
  },
};

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
  const { data: subData, loading: subLoading, error: subError } = useSubscription(ACCOUNT_SUBSCRIPTION);

  useEffect(() => {
    if (listData && listData.getAccountsByUser && subData) {
      console.log('A NEW ACCOUNT WAS ADDED');
      console.log('Current: ', listData.getAccountsByUser);
      console.log('New: ', subData);

      // TODO Re-render list to include subData (new account)
    }
  }, [subData]);

  if (listError) return <div>'Error!'</div>; // You probably want to do more here!
  if (listLoading) return <div>'loading...'</div>; // You can also show a spinner here.

  console.log('GET_ACCOUNTS: ', listData);

  const handleClick = () => {
    console.log('CREATING ACCOUNT');

    createAccountMutateFunction({
      variables: createAccountInput,
    })
      .then((res) => {
        console.log('Account created successfully');
        window.location.pathname = '/dummylist';
      })
      .catch((err) => {
        console.error('Error occurred creating account');
        console.error(err);
      });
  };

  const handleRefresh = () => {
    console.log('REFRESH');

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

          console.log('SUBSCRIPTION TRIGGERED');
          console.log('newEvent: ', newEvent);
          console.log('newEvent data: ', JSON.parse(newEvent.data));

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
      {/* This is from the Apollo client documentation
      <SubscriptionsParent
        {...listData}
        subscribeToNewAccounts={() =>
          subscribeToMore({
            document: ACCOUNT_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const newAccountItem = subscriptionData.data.onCreateEvent;
              console.log('newAccountItem: ', newAccountItem);
              console.log('newAccount data: ', JSON.parse(newAccountItem.data));
              var data = JSON.parse(newAccountItem.data);

              return Object.assign({}, prev, {
                getAccountsByUser: {
                  id: newAccountItem.id, // This should be the event id, not the account id
                  aggregateId: newAccountItem.aggregateId,
                  version: newAccountItem.version,
                  userId: newAccountItem.userId,
                  createdAt: newAccountItem.createdAt,
                  updatedAt: newAccountItem.createdAt,
                  name: data.name,
                  description: data.description,
                  bookValue: data.bookValue,
                  marketValue: data.marketValue,
                  accountType: data.accountType,
                },
                ...prev,
              });
            },
          })
        }
      /> */}
      <button onClick={() => handleClick()}>Submit</button>
      <button onClick={() => handleRefresh()}>Refresh</button>
    </div>
  );
};

export default Dummy;

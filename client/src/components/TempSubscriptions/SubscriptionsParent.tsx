import { useEffect } from 'react';
import { gql, useSubscription } from '@apollo/client';

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

const SubscriptionsParent = () => {
  const { data: subData, loading: subLoading, error: subError } = useSubscription(ACCOUNT_SUBSCRIPTION);

  useEffect(() => {
    if (subData) {
      console.log('A NEW ACCOUNT WAS ADDED');
      console.log('New: ', subData);

      // TODO Re-render list to include subData (new account)
    }
  }, [subData]);

  console.log(subData);

  return <div>DummyList</div>;
};

export default SubscriptionsParent;

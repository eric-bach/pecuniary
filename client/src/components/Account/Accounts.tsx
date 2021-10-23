//https://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/
import { useState, useEffect, useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import { useQuery, useSubscription, gql } from '@apollo/client';

import { UserContext } from '../Auth/User';
import AccountReadModel from './types/Account';
import AccountSummary from './AccountSummary';

// TODO Update schema to include parameter to filter by name and userId
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
const getAccountsByUser = gql`
  query getAccountsByUser($userId: String!) {
    getAccountsByUser(userId: $userId) {
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

const Accounts = () => {
  const [userId, setUserId] = useState('');
  const { data, error, loading, refetch } = useQuery(getAccountsByUser, { variables: { userId: userId } });
  const { data: subData, loading: subLoading, error: subError } = useSubscription(ACCOUNT_SUBSCRIPTION);
  const { getSession } = useContext(UserContext);

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    setTimeout(() => {
      // Get the logged in username
      getSession().then((session: any) => {
        setUserId(session.idToken.payload.email);
      });

      console.log('[ACCOUNTS] hook rendered');
    }, 1000);
  }, []);

  useEffect(() => {
    if (subData) {
      console.log('[ACCOUNTS] New event created: ', subData);

      setTimeout(() => {
        refetch();
        console.log('Refresh');
      }, 2000);
    }
  }, [subData]);

  // TODO Improve these loading screens
  if (error) return 'Error!'; // You probably want to do more here!
  if (loading) return 'Loading...'; // You can also show a spinner here.

  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>
          Accounts ({data.getAccountsByUser.length})
          <Button
            as={Link}
            to='/accounts/new'
            floated='right'
            positive
            content='Create Account'
            data-test='create-account-button'
          />
        </h2>

        <Button.Group>
          <Button labelPosition='left' icon='left chevron' content='Previous' />
          <Button labelPosition='right' icon='right chevron' content='Next' />
        </Button.Group>

        {data &&
          data.getAccountsByUser.map((d: AccountReadModel) => {
            return <AccountSummary key={d.id} {...d} />;
          })}
      </Grid.Column>
      <Grid.Column width={5}>
        <h2>Summary</h2>
        {/* <Doughnut data={data} /> */}
      </Grid.Column>
    </Grid>
  );
};

export default Accounts;

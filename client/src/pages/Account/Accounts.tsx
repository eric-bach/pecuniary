//https://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/
import { useState, useEffect, useContext } from 'react';
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
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const { data, error, loading, refetch } = useQuery(getAccountsByUser, {
    variables: { userId: userId },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });
  const { data: subData } = useSubscription(ACCOUNT_SUBSCRIPTION);
  const { getSession } = useContext(UserContext);

  useEffect(() => {
    // TEMP Force 1000ms delay in loading Account page to ensure backend updates
    setTimeout(() => {
      // Get the logged in username
      getSession().then((session: any) => {
        setUserId(session.idToken.payload.email);
      });

      console.log('[ACCOUNTS] Get username');
      setLoading(false);
    }, 500);
  }, [getSession]);

  useEffect(() => {
    if (subData) {
      console.log('[ACCOUNTS] Event created: ', subData);

      // TEMP Force 1000ms delay before re-loading Accounts to ensure backend updates
      setTimeout(() => {
        refetch();
        console.log('[ACCOUNTS] Re-render components');
      }, 1000);
    }
  }, [subData, refetch]);

  // TODO Improve these loading screens
  if (error) return 'Error!'; // You probably want to do more here!
  if (loading) return 'Loading...'; // You can also show a spinner here.

  if (isLoading) {
    return <div>Loading</div>;
  }
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

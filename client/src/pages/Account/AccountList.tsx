import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import { useQuery, useSubscription } from '@apollo/client';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';
import AccountSummary from './AccountSummary';
import { ACCOUNT_SUBSCRIPTION, GET_ACCOUNT_BY_USER } from './graphql/graphql';

import { CognitoUserSession } from '../types/CognitoUserSession';
import { AccountReadModel } from './types/Account';

const Accounts = () => {
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const {
    data: accounts,
    error,
    loading,
    refetch,
  } = useQuery(GET_ACCOUNT_BY_USER, {
    variables: { userId: userId },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });
  const { data: subscriptions } = useSubscription(ACCOUNT_SUBSCRIPTION);
  const { getSession } = useContext(UserContext);

  useEffect(() => {
    // TEMP Force 1000ms delay in loading Account page to ensure backend updates
    setTimeout(() => {
      // Get the logged in username
      getSession().then((session: CognitoUserSession) => {
        setUserId(session.idToken.payload.email);
      });

      console.log('[ACCOUNTS] Get username');
      setLoading(false);
    }, 500);
  }, [getSession]);

  useEffect(() => {
    if (subscriptions) {
      console.log('[ACCOUNTS] Event created: ', subscriptions);

      // TEMP Force 1000ms delay before re-loading Accounts to ensure backend updates
      setTimeout(() => {
        refetch();
        console.log('[ACCOUNTS] Re-render components');
      }, 2000);
    }
  }, [subscriptions, refetch]);

  // TODO Improve the Error screen
  if (error) return <div>${JSON.stringify(error)}</div>; // You probably want to do more here!
  if (loading || isLoading) return <Loading />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>
          Accounts ({accounts.getAccountsByUser.length})
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

        {accounts &&
          accounts.getAccountsByUser.map((d: AccountReadModel) => {
            return <AccountSummary key={d.id} {...d} />;
          })}
      </Grid.Column>
      <Grid.Column width={5}>
        <h2>Summary</h2>
        {/* <Doughnut data={accounts} /> */}
      </Grid.Column>
    </Grid>
  );
};

export default Accounts;

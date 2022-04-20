import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import { useQuery, useSubscription } from '@apollo/client';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';
import AccountSummary from './AccountSummary';
import { GET_ACCOUNTS } from './graphql/graphql';

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
  } = useQuery(GET_ACCOUNTS, {
    variables: { userId: userId },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });
  //const { data: subscriptions } = useSubscription(ACCOUNT_SUBSCRIPTION);
  const { getSession } = useContext(UserContext);

  useEffect(() => {
    // Get the logged in user
    setTimeout(() => {
      getSession().then((session: CognitoUserSession) => {
        setUserId(session.idToken.payload.email);
      });

      console.log('[ACCOUNTS] Get user:', userId);
      setLoading(false);
    }, 0); // TEMP Force 500ms delay in loading Account page to ensure backend updates
  }, [getSession]);

  // useEffect(() => {
  //   if (subscriptions) {
  //     console.log('[ACCOUNTS] Event created: ', subscriptions);

  //     // TEMP Force 1000ms delay before re-loading Accounts to ensure backend updates
  //     setTimeout(() => {
  //       refetch();
  //       console.log('[ACCOUNTS] Re-render components');
  //     }, 2000);
  //   }
  // }, [subscriptions, refetch]);

  // TODO Improve the Error screen
  if (error) return <div>${JSON.stringify(error)}</div>; // You probably want to do more here!
  if (loading || isLoading) return <Loading />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>
          Accounts ({accounts.getAccounts.length})
          <Button as={Link} to='/accounts/new' floated='right' positive content='Create Account' data-test='create-account-button' />
        </h2>

        <Button.Group>
          <Button labelPosition='left' icon='left chevron' content='Previous' />
          <Button labelPosition='right' icon='right chevron' content='Next' />
        </Button.Group>

        {accounts &&
          accounts.getAccounts.map((d: AccountReadModel) => {
            return <AccountSummary key={d.createdAt.toString()} {...d} />;
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

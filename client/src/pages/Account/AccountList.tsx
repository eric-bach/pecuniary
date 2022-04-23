import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import { useQuery } from '@apollo/client';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';
import AccountSummary from './AccountSummary';
import { GET_ACCOUNTS } from './graphql/graphql';

import { CognitoUserSession } from '../types/CognitoUserSession';
import { AccountReadModel } from './types/Account';

const Accounts = () => {
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  var {
    data: accounts,
    error,
    loading,
  } = useQuery(GET_ACCOUNTS, {
    variables: { userId: userId },
    pollInterval: 3000, // Refresh accounts every 3 seconds
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });

  const { getSession } = useContext(UserContext);

  useEffect(() => {
    // Get the logged in user
    getSession().then((session: CognitoUserSession) => {
      setUserId(session.idToken.payload.email);
      console.log('[ACCOUNTS] Get user:', session.idToken.payload.email);
    });

    setLoading(false);
  }, [getSession]);

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

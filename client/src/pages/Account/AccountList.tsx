import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Divider } from 'semantic-ui-react';
import { useQuery } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';
import AccountSummary from './AccountSummary';
import { GET_ACCOUNTS } from './graphql/graphql';

import { CognitoUserSession } from '../types/CognitoUserSession';
import { AccountReadModel } from './types/Account';
import client from '../../client';
import { database } from 'faker';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8,
};

const Accounts = () => {
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  // const [lastEvaluatedKey, setLastEvaluatedKey] = useState();
  const [addAccounts, setAddAccounts] = useState();
  const [temp, setTemp]: [any[], any] = useState([]);
  const [items, setItems] = useState(3);

  const {
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

  // //setLastEvaluatedKey(accounts.getAccounts[accounts.getAccounts.length - 1].lastEvaluatedKey);
  var lastEvaluatedKey = accounts.getAccounts[accounts.getAccounts.length - 1].lastEvaluatedKey;
  console.log('[ACCOUNTS] LastEvaluatedKey:', lastEvaluatedKey);
  console.log('[ACCOUNTS] Accounts:', accounts.getAccounts);
  console.log('[ACCOUNTS] Accounts 2:', temp);
  console.log('[ACCOUNTS] Items:', items);

  const fetchMoreData = async () => {
    console.log('get more');

    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: userId,
        lastEvaluatedKey: lastEvaluatedKey,
      },
    });
    console.log('MORE RESPONSE: ', response);

    if (response.data) {
      console.log('MORE ACCOUNTS: ', response.data.getAccounts);
      setTemp(...temp, response.data.getAccounts);
      setItems(items + response.data.getAccounts.length);
      console.log('ADDITIONAL ACCOUNTS: ', temp);
    }
  };

  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <h2>
            Accounts ({accounts.getAccounts.length + temp?.length})
            <Button as={Link} to='/accounts/new' floated='right' positive content='Create Account' data-test='create-account-button' />
          </h2>
          <Divider hidden />
          <InfiniteScroll dataLength={accounts.getAccounts.length} next={fetchMoreData} hasMore={true} loader={<h4>Loading...</h4>}>
            {accounts.getAccounts.map((d: any) => {
              return <AccountSummary key={d.sk.toString()} {...d} />;
            })}
            {temp?.map((e: any) => {
              return <AccountSummary key={e.sk.toString()} {...e} />;
            })}
          </InfiniteScroll>
        </Grid.Column>
      </Grid>
    </div>
  );

  /*
  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>
          Accounts ({accounts.getAccounts.length})
          <Button as={Link} to='/accounts/new' floated='right' positive content='Create Account' data-test='create-account-button' />
        </h2>

        <Divider hidden />

        <InfiniteScroll dataLength={length} next={fetchMoreData} hasMore={true} loader={<h4>Loading...</h4>}>
          {items.map((i, index) => (
            <div style={style} key={index}>
              div - #{index}
            </div>
          ))}
        </InfiniteScroll>

         {accounts &&
          accounts.getAccounts.map((d: AccountReadModel) => {
            return <AccountSummary key={d.sk.toString()} {...d} />;
          })} 
      </Grid.Column>
      <Grid.Column width={5}>
        <h2>Summary</h2>
        {/* <Doughnut data={accounts} /> *}
      </Grid.Column>
    </Grid>
  );
  */
};

export default Accounts;

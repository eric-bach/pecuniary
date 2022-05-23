import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Divider } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import client from '../../client';
import AccountSummary from './AccountSummary';
import Loading from '../../components/Loading';

import { GET_ACCOUNTS } from './graphql/graphql';
import { AccountReadModel } from './types/Account';

const AccountList = () => {
  const [userId, setUserId] = useState('');
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState();
  const [accounts, setAccounts]: [any, any] = useState([]);

  const [hasMore, setHasMore] = useState(false);

  const getInitialData = async () => {
    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: sessionStorage.getItem('userId'),
      },
    });

    if (response && response.data) {
      console.log('[ACCOUNT LIST] Get Accounts:', response.data.getAccounts.items);
      setLastEvaluatedKey(response.data.getAccounts.lastEvaluatedKey);
      console.log('[ACCOUNT LIST] Last Evaluated Key:', response.data.getAccounts.lastEvaluatedKey);

      setAccounts(response.data.getAccounts.items);
      if (response.data.getAccounts.lastEvaluatedKey) {
        setHasMore(true);
      }
    }
  };

  async function getMoreData() {
    if (lastEvaluatedKey === null) {
      setHasMore(false);
      return;
    }

    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: userId,
        lastEvaluatedKey: lastEvaluatedKey,
      },
    });

    if (response && response.data) {
      console.log('[ACCOUNT LIST] Get more Accounts:', response.data.getAccounts.items);
      setLastEvaluatedKey(response.data.getAccounts.lastEvaluatedKey);
      console.log('[ACCOUNT LIST] Last Evaluated Key:', response.data.getAccounts.lastEvaluatedKey);

      setAccounts([...accounts, ...response.data.getAccounts.items]);
      if (response.data.getAccounts.lastEvaluatedKey) {
        setHasMore(true);
      }
    }
  }

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) setUserId(userId);

    getInitialData();
  }, []);

  if (accounts.length == 0) {
    return <Loading />;
  }

  console.log('[ACCOUNT LIST] Accounts:', accounts);

  return (
    <>
      <Grid>
        <Grid.Column width={10}>
          <h2>
            Accounts ({accounts.length} loaded)
            <Button as={Link} to='/accounts/new' floated='right' positive content='Create Account' data-test='create-account-button' />
          </h2>
          <Divider hidden />

          <InfiniteScroll dataLength={accounts.length} next={getMoreData} hasMore={hasMore} loader={<Loading />}>
            {accounts.map((d: AccountReadModel) => {
              return <AccountSummary key={d.sk.toString()} {...d} />;
            })}
          </InfiniteScroll>
        </Grid.Column>
        <Grid.Column width={5}>
          <h2>Summary - TBA</h2>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default AccountList;

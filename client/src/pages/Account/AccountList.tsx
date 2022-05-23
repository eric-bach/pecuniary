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
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState();
  const [accounts, setAccounts]: [any, any] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);

  const getAccounts = async () => {
    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: sessionStorage.getItem('userId'),
        lastEvaluatedKey: lastEvaluatedKey,
      },
    });

    if (response && response.data) {
      console.log('[ACCOUNT LIST] Get Accounts:', response.data.getAccounts.items);
      setLastEvaluatedKey(response.data.getAccounts.lastEvaluatedKey);
      console.log('[ACCOUNT LIST] Last Evaluated Key:', response.data.getAccounts.lastEvaluatedKey);

      setAccounts([...accounts, ...response.data.getAccounts.items]);
      if (response.data.getAccounts.lastEvaluatedKey) {
        setHasMoreData(true);
      }
    }
  };

  async function getAdditionalAccounts() {
    if (lastEvaluatedKey === null) {
      setHasMoreData(false);
      return;
    }

    await getAccounts();
  }

  useEffect(() => {
    getAccounts();
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

          <InfiniteScroll dataLength={accounts.length} next={getAdditionalAccounts} hasMore={hasMoreData} loader={<Loading />}>
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

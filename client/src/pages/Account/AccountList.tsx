import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Divider } from 'semantic-ui-react';
import axios from 'axios';
import client from '../../client';
import { GET_ACCOUNTS } from './graphql/graphql';
import Loading from '../../components/Loading';
import { AccountReadModel } from './types/Account';
import AccountSummary from './AccountSummary';
import InfiniteScroll from 'react-infinite-scroll-component';

const AccountList = () => {
  const [userId, setUserId] = useState('');
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState();
  const [accountData, setAccountData]: [any, any] = useState([]);

  const [hasMore, setHasMore] = useState(false);
  const [data, setData]: [any, any] = useState([]);
  const [page, setPage]: [any, any] = useState(1);
  // const [isFetching, setIsFetching]: any[] = useInfiniteScroll(moreData);

  const loadData = async () => {
    let url = 'https://medrum.herokuapp.com/articles';
    axios.get(url).then((res) => {
      setData(res.data);
    });

    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: sessionStorage.getItem('userId'),
      },
    });
    if (response.data) {
      console.log('GOT ACCOUNTS: ', response.data.getAccounts.items);
      setLastEvaluatedKey(response.data.getAccounts.lastEvaluatedKey);
      console.log('LAST EVALUATED KEY: ', response.data.getAccounts.lastEvaluatedKey);

      // TEMP Set data here
      setAccountData(response.data.getAccounts.items);
      if (response.data.getAccounts.lastEvaluatedKey) {
        setHasMore(true);
      }
    }
  };

  async function moreData() {
    let url = `https://medrum.herokuapp.com/feeds/?source=5718e53e7a84fb1901e05971&page=${page}&sort=latest`;
    axios.get(url).then((res) => {
      setData([...data, ...res.data]);
      setPage(page + 1);
      // setIsFetching(false);
    });

    if (lastEvaluatedKey === null) {
      setHasMore(false);
      return;
    }

    console.log('***GETTING MORE WITH: ', lastEvaluatedKey);
    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: userId,
        lastEvaluatedKey: lastEvaluatedKey,
      },
    });
    if (response && response.data) {
      console.log('GOT ACCOUNTS: ', response.data.getAccounts.items);
      setLastEvaluatedKey(response.data.getAccounts.lastEvaluatedKey);
      console.log('LAST EVALUATED KEY: ', response.data.getAccounts.lastEvaluatedKey);

      // TEMP Set data here
      setAccountData([...accountData, ...response.data.getAccounts.items]);
      if (response.data.getAccounts.lastEvaluatedKey) {
        setHasMore(true);
      }
    }
  }

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) setUserId(userId);

    loadData();
  }, []);

  if (data.length == 0) {
    return <Loading />;
  }

  console.log('🚀 ALL THE ACCOUNTS:', accountData);

  return (
    <>
      <Grid>
        <Grid.Column width={10}>
          <h2>
            Accounts ({accountData.length} loaded)
            <Button as={Link} to='/accounts/new' floated='right' positive content='Create Account' data-test='create-account-button' />
          </h2>
          <Divider hidden />

          <InfiniteScroll dataLength={accountData.length} next={moreData} hasMore={hasMore} loader={<Loading />}>
            {accountData.map((d: AccountReadModel) => {
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

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Divider } from 'semantic-ui-react';
import axios from 'axios';
import useInfiniteScroll from './useInfinite';
import client from '../../client';
import { GET_ACCOUNTS } from './graphql/graphql';
import Loading from '../../components/Loading';
import { AccountReadModel } from './types/Account';
import AccountSummary from './AccountSummary';

const AccountList = () => {
  const [userId, setUserId] = useState('');
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState();
  const [accountData, setAccountData]: [any, any] = useState([]);

  const [data, setData]: [any, any] = useState([]);
  const [page, setPage]: [any, any] = useState(1);
  const [isFetching, setIsFetching]: any[] = useInfiniteScroll(moreData);

  const loadData = async () => {
    let url = 'https://medrum.herokuapp.com/articles';
    axios.get(url).then((res) => {
      setData(res.data);
    });

    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: sessionStorage.getItem('userId'),
        lastEvaluatedKey: lastEvaluatedKey,
      },
    });
    if (response.data) {
      console.log('GOT ACCOUNTS: ', response.data.getAccounts);
      setLastEvaluatedKey(response.data.getAccounts[0].lastEvaluatedKey);
      console.log('LAST EVALUATED KEY: ', response.data.getAccounts[0].lastEvaluatedKey);

      // TEMP Set data here
      setAccountData(response.data.getAccounts);
    }
  };

  async function moreData() {
    let url = `https://medrum.herokuapp.com/feeds/?source=5718e53e7a84fb1901e05971&page=${page}&sort=latest`;
    axios.get(url).then((res) => {
      setData([...data, ...res.data]);
      setPage(page + 1);
      setIsFetching(false);
    });

    console.log('***GETTING MORE WITH: ', lastEvaluatedKey);

    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: userId,
        lastEvaluatedKey: lastEvaluatedKey,
      },
    });
    if (response.data) {
      console.log('GOT ACCOUNTS: ', response.data.getAccounts);
      setLastEvaluatedKey(response.data.getAccounts[0].lastEvaluatedKey);
      console.log('LAST EVALUATED KEY: ', response.data.getAccounts[0].lastEvaluatedKey);

      // TEMP Set data here
      setAccountData([...accountData, ...response.data.getAccounts]);
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
            Accounts ({accountData.length})
            <Button as={Link} to='/accounts/new' floated='right' positive content='Create Account' data-test='create-account-button' />
          </h2>
          <Divider hidden />

          {accountData &&
            accountData.map((d: AccountReadModel) => {
              return <AccountSummary key={d.sk.toString()} {...d} />;
            })}
        </Grid.Column>
        <Grid.Column width={5}>
          <h2>Summary - TBA</h2>
        </Grid.Column>
      </Grid>

      <ul className='list-group-ul'>
        {data.map((article: any, key: any) => (
          <li className='list-group-li' key={key}>
            {key + 1}.{' '}
            <a href={article.url} target='_blank'>
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AccountList;

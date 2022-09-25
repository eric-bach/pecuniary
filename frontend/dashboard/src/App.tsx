import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { gql } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';

import Loading from './components/Loading';

export const GET_ACCOUNTS = gql`
  query GetAccounts($userId: String!, $lastEvaluatedKey: LastEvaluatedKey) {
    getAccounts(userId: $userId, lastEvaluatedKey: $lastEvaluatedKey) {
      items {
        userId
        sk
        aggregateId
        type
        name
        description
        currencies {
          currency
          bookValue
          marketValue
        }
      }
      lastEvaluatedKey {
        userId
        sk
      }
    }
  }
`;

const useStyles = makeStyles(() => ({
  root: {},
  session: {
    width: '80vw',
    overflow: 'auto',
    overflowWrap: 'break-word',
    fontSize: '16px',
  },
}));

export default ({ client }: any) => {
  const classes = useStyles();

  const [lastEvaluatedKey, setLastEvaluatedKey]: [any, any] = useState();
  const [accounts, setAccounts]: [any, any] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [loading, setLoading]: [boolean, any] = useState(true);

  const getAccounts = async () => {
    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: localStorage.getItem('userId'),
        lastEvaluatedKey: lastEvaluatedKey
          ? {
              userId: lastEvaluatedKey.userId,
              sk: lastEvaluatedKey.sk,
            }
          : lastEvaluatedKey,
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

    setLoading(false);
  };

  async function getAdditionalAccounts() {
    if (lastEvaluatedKey === null) {
      setHasMoreData(false);
      return;
    }

    await getAccounts();

    setLoading(false);
  }

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!accounts) {
    return <Loading />;
  }

  console.log('[DASHBOARD] Apollo Client', client);
  console.log('[ACCOUNT LIST] Accounts:', accounts);

  return (
    <Grid container>
      <Grid className={classes.root} container direction='column' justifyContent='flex-start' alignItems='flex-start'>
        <Typography variant='h5'>Accounts ({accounts.length} loaded) </Typography>
        <InfiniteScroll dataLength={accounts.length} next={getAdditionalAccounts} hasMore={hasMoreData} loader={<Loading />}>
          {accounts.map((d: any) => {
            return d.name.toString(); //<AccountSummary key={d.sk.toString()} {...d} />;
          })}
        </InfiniteScroll>
      </Grid>
    </Grid>
  );
};

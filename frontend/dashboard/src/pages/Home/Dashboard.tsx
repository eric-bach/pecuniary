import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { gql } from '@apollo/client';

import Loading from '../../components/Loading';
import UserContext from '../../contexts/UserContext';

function groupByAccountType(items: any[]) {
  var result = items.reduce(function (r: any[], a: any) {
    r[a.type] = r[a.type] || [];
    r[a.type].push(a);
    return r;
  }, Object.create(null));

  return result;
}

function groupByCurrency(items: any[]) {
  var result = items.reduce(function (r: any[], a: any) {
    r[a.currency] = r[a.currency] || [];
    r[a.currency].push(a);
    return r;
  }, Object.create(null));

  return result;
}

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

export default function Dashboard() {
  const [lastEvaluatedKey, setLastEvaluatedKey]: [any, any] = useState();
  const [accounts, setAccounts]: [any, any] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [isLoading, setLoading]: [boolean, any] = useState(true);
  const client: any = useContext(UserContext);

  const getAccounts = async () => {
    console.log('[DASHBOARD] Getting Accounts');

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

    console.log('[DASHBOARD] Retrieved Accounts: ', response);

    if (response && response.data) {
      console.log('[DASHBOARD] Get Accounts:', response.data.getAccounts.items);
      setLastEvaluatedKey(response.data.getAccounts.lastEvaluatedKey);
      console.log('[DASHBOARD] Last Evaluated Key:', response.data.getAccounts.lastEvaluatedKey);

      setAccounts([...accounts, ...response.data.getAccounts.items]);
      if (response.data.getAccounts.lastEvaluatedKey) {
        setHasMoreData(true);
      }
    }

    setLoading(false);
  };

  // https://devtrium.com/posts/async-functions-useeffect
  useEffect(() => {
    console.log('***Getting Accounts here');
    getAccounts();
    console.log('***Returned from Getting Accounts here');
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Get all Positions in Account along with their Account Type
  var positions: any = [];
  accounts.forEach((acc: any) => {
    acc.currencies.forEach((cur: any) => {
      var pos = { ...cur, type: acc.type };
      // console.log('[HOME PAGE] Denormalized Position:', pos);
      positions.push(pos);
    });
  });
  console.log('[HOME PAGE] Positions: ', positions);

  // Get book/market values by Account Type and Currency
  var currencies: any = [];
  var type: any, p: any;
  for ([type, p] of Object.entries(groupByAccountType(positions))) {
    var positionsGrouped = groupByCurrency(p);

    // Sum book/marketValue for grouped positions
    var key: any, value: any;
    for ([key, value] of Object.entries(positionsGrouped)) {
      let bookValue = 0;
      let marketValue = 0;
      value.forEach((v: any) => {
        bookValue += v.bookValue;
        marketValue += v.marketValue;
      });

      var currency: any = {
        type,
        currency: key,
        bookValue,
        netWorth: marketValue,
        profit: marketValue - bookValue,
        profitP: ((marketValue - bookValue) / bookValue) * 100,
      };
      // console.log('[HOME PAGE] Currency:', currency);
      currencies.push(currency);
    }
  }
  console.log('[HOME PAGE] Currencies:', currencies);

  return (
    <Container>
      <Typography variant='h4' align='left' color='textPrimary' gutterBottom>
        Account Performance
      </Typography>
      {currencies.map((c: any) => {
        return (
          <div key={c.type + '#' + c.currency}>
            <Typography variant='h5' align='left' color='textPrimary' gutterBottom>
              {c.type} ({c.currency})
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                      Net Worth
                    </Typography>
                    <Typography variant='h5' component='div'>
                      <NumberFormat
                        value={c.netWorth}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color={c.profit >= 0 ? 'green' : 'red'} gutterBottom>
                      Return ($)
                    </Typography>
                    <Typography variant='h5' component='div'>
                      <NumberFormat
                        value={c.profit}
                        style={{ color: c.profit >= 0 ? 'green' : 'red' }}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color={c.profit >= 0 ? 'green' : 'red'} gutterBottom>
                      Return (%)
                    </Typography>
                    <Typography variant='h5' component='div'>
                      <NumberFormat
                        value={c.profitP}
                        displayType={'text'}
                        style={{ color: c.profit >= 0 ? 'green' : 'red' }}
                        thousandSeparator={true}
                        suffix={'%'}
                        decimalScale={1}
                        fixedDecimalScale={true}
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        );
      })}
      {/* <Link to='/app/accounts'>
        <Button name='toAccounts' variant='contained' color='primary'>
          Accounts
        </Button>
      </Link> */}
    </Container>
  );
}

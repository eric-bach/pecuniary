import { useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { Statistic, Divider, Header, Icon } from 'semantic-ui-react';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';

import { CognitoUserSession } from '../types/CognitoUserSession';
import { GET_ACCOUNTS } from './graphql/graphql';
import NumberFormat from 'react-number-format';

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

const HomePage = () => {
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  const { data, error, loading } = useQuery(GET_ACCOUNTS, {
    variables: { userId: userId },
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

  if (error) return <div>${JSON.stringify(error)}</div>; // You probably want to do more here!
  if (loading || isLoading) return <Loading />;

  console.log('[HOME PAGE] Accounts:', data);
  const accounts = data.getAccounts;

  // Get all Positions in Account along with their Account Type
  var positions: any = [];
  accounts.forEach((acc: any) => {
    acc.currencies.forEach((cur: any) => {
      var pos = { ...cur, type: acc.type };
      console.log('Denormalized Position:', pos);
      positions.push(pos);
    });
  });
  console.log('All Positions: ', positions);

  // Get book/market values by Account Type and Currency
  var currencies: any = [];
  var type: any, positions: any;
  for ([type, positions] of Object.entries(groupByAccountType(positions))) {
    var positionsGrouped = groupByCurrency(positions);

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
      console.log('Currency:', currency);
      currencies.push(currency);
    }
  }
  console.log('Currencies:', currencies);

  return (
    <>
      {/* <Message color='teal' header='Welcome back!' content='Here is your account overview.' /> */}
      <Header as='h2'>
        <Icon name='line graph' />
        <Header.Content>
          Account Performance
          <Header.Subheader>Summary of investment return</Header.Subheader>
        </Header.Content>
      </Header>
      <Divider hidden />
      {currencies.map((c: any) => {
        return (
          <div key={c.type + '#' + c.currency}>
            <Header as='h1'>
              {c.type} ({c.currency})
            </Header>
            <Statistic.Group widths='three'>
              <Statistic>
                <Statistic.Value>
                  <NumberFormat value={c.netWorth} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
                </Statistic.Value>
                <Statistic.Label>Net Worth</Statistic.Label>
              </Statistic>
              <Statistic color={c.profit >= 0 ? 'green' : 'red'}>
                <Statistic.Value>
                  <NumberFormat value={c.profit} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
                </Statistic.Value>
                <Statistic.Label>Return ($)</Statistic.Label>
              </Statistic>
              <Statistic color={c.profit >= 0 ? 'green' : 'red'}>
                <Statistic.Value>
                  <NumberFormat value={c.profitP} displayType={'text'} thousandSeparator={true} suffix={'%'} decimalScale={1} />
                </Statistic.Value>
                <Statistic.Label>Return (%)</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </div>
        );
      })}
    </>
  );
};

export default HomePage;

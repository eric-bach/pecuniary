import NumberFormat from 'react-number-format';
import { Statistic, Divider, Header, Icon } from 'semantic-ui-react';

import client from '../../client';
import Loading from '../../components/Loading';
import { GET_ACCOUNTS } from './graphql/graphql';
import { useEffect, useState } from 'react';

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
  const [accounts, setAccounts]: [any, any] = useState([]);

  useEffect(() => {
    const getAccounts = async () => {
      var accts: any[] = [];
      var lastEvaluatedKey;
      var counter: number = 0;

      do {
        const response: any = await client.query({
          query: GET_ACCOUNTS,
          variables: {
            userId: localStorage.getItem('userId'),
            lastEvaluatedKey: lastEvaluatedKey,
          },
        });

        if (response && response.data) {
          console.log('[HOME PAGE] Get Accounts:', response.data.getAccounts.items);
          Array.prototype.push.apply(accts, response.data.getAccounts.items);

          lastEvaluatedKey = response.data.getAccounts.lastEvaluatedKey;
          console.log('[HOME PAGE] Last Evaluated Key:', lastEvaluatedKey);
        }

        ++counter;
      } while (lastEvaluatedKey !== null || counter > 100); // Limit to 100 calls

      setAccounts([...accounts, ...accts]);
    };

    getAccounts();
  }, [accounts]);

  if (accounts.length === 0) {
    return <Loading />;
  }

  console.log('[HOME PAGE] Accounts:', accounts);

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
    <>
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
                  <NumberFormat
                    value={c.netWorth}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Statistic.Value>
                <Statistic.Label>Net Worth</Statistic.Label>
              </Statistic>
              <Statistic color={c.profit >= 0 ? 'green' : 'red'}>
                <Statistic.Value>
                  <NumberFormat
                    value={c.profit}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Statistic.Value>
                <Statistic.Label>Return ($)</Statistic.Label>
              </Statistic>
              <Statistic color={c.profit >= 0 ? 'green' : 'red'}>
                <Statistic.Value>
                  <NumberFormat
                    value={c.profitP}
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix={'%'}
                    decimalScale={1}
                    fixedDecimalScale={true}
                  />
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

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Label, Button, Table } from 'semantic-ui-react';
import { useQuery } from '@apollo/client';
import NumberFormat from 'react-number-format';
import InfiniteScroll from 'react-infinite-scroll-component';

import client from '../../client';
import Loading from '../../components/Loading';
import Positions from '../Position/Positions';
import TransactionList from '../Transaction/TransactionList';
import { GET_POSITIONS, GET_TRANSACTIONS } from './graphql/graphql';
import { TransactionReadModel } from '../Transaction/types/Transaction';
import { AccountProps } from './types/Account';

const AccountDetail = (props: AccountProps) => {
  const [account] = useState(props.location.state.account);
  const [lastEvaluatedKey, setLastEvaluatedKey]: [any, any] = useState();
  const [transactions, setTransactions]: [any, any] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);

  const {
    data: pos,
    error: posError,
    loading: posLoading,
  } = useQuery(GET_POSITIONS, {
    variables: { userId: account.userId, aggregateId: account.aggregateId },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });

  const getTransactions = async () => {
    console.log('asdasfsdf', lastEvaluatedKey);
    const response = await client.query({
      query: GET_TRANSACTIONS,
      variables: {
        userId: localStorage.getItem('userId'),
        aggregateId: account.aggregateId,
        lastEvaluatedKey: lastEvaluatedKey
          ? {
              userId: lastEvaluatedKey.userId,
              sk: lastEvaluatedKey.sk,
              transactionDate: lastEvaluatedKey.transactionDate,
              aggregateId: lastEvaluatedKey.aggregateId,
            }
          : lastEvaluatedKey,
      },
    });

    if (response && response.data) {
      console.log('[ACCOUNT DETAIL] Get Transations:', response.data.getTransactions.items);
      console.log('[ACCOUNT DETAIL] Last Evaluated Key:', response.data.getTransactions.lastEvaluatedKey);
      setLastEvaluatedKey(response.data.getTransactions.lastEvaluatedKey);

      setTransactions([...transactions, ...response.data.getTransactions.items]);
      if (response.data.getTransactions.lastEvaluatedKey) {
        setHasMoreData(true);
      }
    }
  };

  async function getAdditionalTransactions() {
    if (lastEvaluatedKey === null) {
      setHasMoreData(false);
      return;
    }

    await getTransactions();
  }

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('[ACCOUNT DETAIL] Account: ', account);

  // TODO Improve this Error page
  if (posError)
    return (
      <>
        <div>${posError}</div>
      </>
    ); // You probably want to do more here!
  if (posLoading || transactions.length === 0) return <Loading />;

  console.log('[ACCOUNT DETAIL] Positions: ', pos);
  console.log('[ACCOUNT DETAIL] Transactions: ', transactions);
  console.log('[ACCOUNT DETAIL] LastEvaluatedKey: ', lastEvaluatedKey);
  console.log('[ACCOUNT DETAIL] HasMoreDate: ', hasMoreData);

  let netWorth = 0;
  pos.getPositions.map((p: any) => {
    netWorth += p.marketValue;
    return netWorth;
  });
  console.log('[ACCOUNT DETAIL] NetWorth: ', netWorth);

  return (
    <>
      <h2>Account</h2>
      <Segment.Group>
        <Segment>
          <Label as='span' color={`${account.type === 'RRSP' ? 'red' : 'blue'}`} ribbon>
            {account.type}
          </Label>
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header>
                  <div>{account.name}</div>
                </Item.Header>
                <Item.Description>{account.description}</Item.Description>

                {account.currencies.map((c) => {
                  return (
                    <div key={c.currency}>
                      <Item.Meta>
                        <span>{c.currency}:</span>
                        <NumberFormat
                          value={c.bookValue}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                        />
                        {'(Book Value) '}
                        <NumberFormat
                          value={c.marketValue}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                          decimalScale={2}
                          fixedDecimalScale={true}
                        />
                        {' (Market Value)'}
                      </Item.Meta>
                    </div>
                  );
                })}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment.Group>
      {/* TODO Add Graphs here */}
      <div>
        {/* <h2>Summary</h2>
        <br /> */}
      </div>
      <Positions positions={pos.getPositions} />
      <br />
      <Button
        as={Link}
        to={{
          pathname: '/transactions/new',
          state: {
            account: account,
          },
        }}
        floated='right'
        positive
        content='Add Transaction'
        data-test='add-transaction-button'
      />
      {/* <TransactionList transactions={transactions} /> */}
      <span>
        <h2>Transaction List</h2>
        <Table selectable color='teal' key='teal'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Symbol</Table.HeaderCell>
              <Table.HeaderCell>Shares</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Commission</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <InfiniteScroll dataLength={transactions.length} next={getAdditionalTransactions} hasMore={hasMoreData} loader={<Loading />}>
              {transactions.map((t: TransactionReadModel) => {
                let color = t.type === 'Buy' ? 'blue' : 'red';

                // Read the transactionDate as it (without timezone offsets)
                let utcTransactionDate = new Date(t.transactionDate);
                var timezoneOffset = new Date().getTimezoneOffset() * 60000;
                let transactionDate = new Date(utcTransactionDate.getTime() - -timezoneOffset);

                return (
                  <Table.Row key={t.sk}>
                    <Table.Cell className={`ui ${color} label`} style={{ margin: '8px' }}>
                      {t.type}
                    </Table.Cell>
                    <Table.Cell>{transactionDate.toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{t.symbol}</Table.Cell>
                    <Table.Cell>{t.shares}</Table.Cell>
                    <Table.Cell>
                      <NumberFormat
                        value={t.price}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <NumberFormat
                        value={t.commission}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        floated='right'
                        icon='file alternate outline'
                        as={Link}
                        to={{
                          pathname: `/transactions/view/${t.sk}`,
                          state: {
                            transaction: t,
                          },
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </InfiniteScroll>
          </Table.Body>
        </Table>
      </span>
    </>
  );
};

export default AccountDetail;

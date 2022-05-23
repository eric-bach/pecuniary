import { Button, Table } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';

import client from '../../client';
import Loading from '../../components/Loading';
import { GET_TRANSACTIONS } from './graphql/graphql';
import { TransactionReadModel, TransactionsProps } from './types/Transaction';

const TransactionList = (props: TransactionsProps) => {
  const transactions = props.transactions;
  console.log('[TRANSACTIONS LIST] Received transactions: ', transactions);

  const [lastEvaluatedKey, setLastEvaluatedKey] = useState();
  const [trans, setTrans]: [any, any] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);

  const getTransactions = async () => {
    const response = await client.query({
      query: GET_TRANSACTIONS,
      variables: {
        userId: localStorage.getItem('userId'),
        aggregateId: transactions[0].aggregateId,
        lastEvaluatedKey: lastEvaluatedKey,
      },
    });

    if (response && response.data) {
      console.log('[TRANASCTIONS LIST] Get Transations:', response.data.getTransactions.items);
      setLastEvaluatedKey(response.data.getTransactions.lastEvaluatedKey);
      console.log('[TRANSACTIONS LIST] Last Evaluated Key:', response.data.getTransactions.lastEvaluatedKey);

      setTrans([...trans, ...response.data.getTransactions.items]);
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

  return (
    <div>
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
    </div>
  );
};

export default TransactionList;

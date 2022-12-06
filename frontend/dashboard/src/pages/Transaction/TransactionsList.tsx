import React, { useState, useEffect, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { TransactionsProps } from './types/Transaction';
import { GET_TRANSACTIONS } from './graphql/graphql';
import UserContext from '../../contexts/UserContext';
import Loading from '../../components/Loading';

const TransactionsList = (props: TransactionsProps) => {
  const aggregateId = props.aggregateId;
  console.log('[TRANSACTIONS LIST] Retrieving transactions for: ', aggregateId);

  const [lastEvaluatedKey, setLastEvaluatedKey]: [any, any] = useState();
  const [transactions, setTransactions]: [any, any] = useState([]);
  const [isLoading, setLoading]: [boolean, any] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(false);
  const client: any = useContext(UserContext);

  const getTransactions = async () => {
    const response = await client.query({
      query: GET_TRANSACTIONS,
      variables: {
        userId: localStorage.getItem('userId'),
        aggregateId: aggregateId,
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
      console.log('[TRANASCTIONS LIST] Get Transations:', response.data.getTransactions.items);
      console.log('[TRANSACTIONS LIST] Last Evaluated Key:', response.data.getTransactions.lastEvaluatedKey);
      setLastEvaluatedKey(response.data.getTransactions.lastEvaluatedKey);

      setTransactions([...transactions, ...response.data.getTransactions.items]);
      if (response.data.getTransactions.lastEvaluatedKey) {
        setHasMoreData(true);
      }

      setLoading(false);
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

  if (isLoading) {
    return <Loading />;
  }

  console.log('[TRANSACTIONS LIST] Transactions: ', transactions);
  console.log('[TRANSACTIONS LIST] LastEvaluatedKey: ', lastEvaluatedKey);
  console.log('[TRANSACTIONS LIST] HasMoreDate: ', hasMoreData);

  return (
    <>
      <InfiniteScroll dataLength={transactions.length} next={getAdditionalTransactions} hasMore={hasMoreData} loader={<Loading />}>
        Display Transactions Here
      </InfiniteScroll>
    </>
  );
};

export default TransactionsList;

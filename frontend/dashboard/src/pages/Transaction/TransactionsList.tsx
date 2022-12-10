import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { TransactionReadModel, TransactionsProps } from './types/Transaction';
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

  const link = `/app/transactions/new/${aggregateId}`;

  return (
    <InfiniteScroll dataLength={transactions.length} next={getAdditionalTransactions} hasMore={hasMoreData} loader={<Loading />}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align='right'>Date</TableCell>
              <TableCell align='right'>Symbol</TableCell>
              <TableCell align='right'>Shres</TableCell>
              <TableCell align='right'>Price</TableCell>
              <TableCell align='right'>Commission</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t: TransactionReadModel) => (
              <TableRow
                key={t.sk}
                // component={Link}
                // to={{ pathname: link, state: { transaction: t } }}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {t.type}
                </TableCell>
                <TableCell align='right'>{t.transactionDate}</TableCell>
                <TableCell align='right'>{t.symbol}</TableCell>
                <TableCell align='right'>{t.shares}</TableCell>
                <TableCell align='right'>{t.price}</TableCell>
                <TableCell align='right'>{t.commission}</TableCell>
                <TableCell align='right'>
                  <Button id='edit' variant='contained' component={Link} to={{ pathname: link, state: { transaction: t } }}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </InfiniteScroll>
  );
};

export default TransactionsList;

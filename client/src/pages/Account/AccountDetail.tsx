import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Label, Button } from 'semantic-ui-react';
import { useQuery } from '@apollo/client';
import NumberFormat from 'react-number-format';

import Loading from '../../components/Loading';
import Positions from '../Position/Positions';
import TransactionList from '../Transaction/TransactionList';
import { GET_POSITIONS, GET_TRANSACTIONS } from './graphql/graphql';
import { AccountProps } from './types/Account';

const AccountDetail = (props: AccountProps) => {
  const [account] = useState(props.location.state.account);
  const {
    data: pos,
    error: posError,
    loading: posLoading,
  } = useQuery(GET_POSITIONS, {
    variables: { userId: account.userId, aggregateId: account.aggregateId },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });
  const {
    data: trans,
    error: transError,
    loading: transLoading,
  } = useQuery(GET_TRANSACTIONS, {
    variables: {
      userId: account.userId,
      aggregateId: account.aggregateId,
    },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });

  console.log('[ACCOUNT DETAIL] Account: ', account);

  // TODO Improve this Error page
  if (posError || transError)
    return (
      <>
        <div>${posError}</div>
        <div>${transError}</div>
      </>
    ); // You probably want to do more here!
  if (posLoading || transLoading) return <Loading />;

  console.log('[ACCOUNT DETAIL] Positions: ', pos);
  console.log('[ACCOUNT DETAIL] Transactions: ', trans);

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
      <TransactionList transactions={trans.getTransactions} />
    </>
  );
};

export default AccountDetail;

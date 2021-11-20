import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Label, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { useQuery } from '@apollo/client';

import Positions from '../Position/Positions';
import Loading from '../../components/Loading';
import TransactionList from '../Transaction/TransactionList';
import { GET_POSITIONS_BY_ACCOUNT, GET_TRANSACTIONS_BY_ACCOUNT } from './graphql/graphql';

const AccountDetail = (props: any) => {
  const [account] = useState(props.location.state.account);

  console.log('[ACCOUNT DETAIL] Account: ', account);

  const {
    data: pos,
    error: posError,
    loading: posLoading,
  } = useQuery(GET_POSITIONS_BY_ACCOUNT, {
    variables: { accountId: account.id },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });
  const {
    data: trans,
    error: transError,
    loading: transLoading,
  } = useQuery(GET_TRANSACTIONS_BY_ACCOUNT, {
    variables: { accountId: account.id },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });

  // TODO Improve these loading screens
  if (posError || transError) return 'Error!'; // You probably want to do more here!
  if (posLoading || transLoading) return <Loading />;

  console.log('[ACCOUNT DETAIL] Positions: ', pos);
  console.log('[ACCOUNT DETAIL] Transactions: ', trans);

  return (
    <>
      <h2>Account</h2>
      <Segment.Group>
        <Segment>
          <Label as='span' color={`${account.accountType.name === 'RRSP' ? 'red' : 'blue'}`} ribbon>
            {account.accountType.name}
          </Label>
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header>
                  <div>{account.name}</div>
                </Item.Header>
                <Item.Meta>
                  Book Value:{' '}
                  <NumberFormat value={account.bookValue} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Item.Meta>
                <Item.Meta>
                  Market Value:{' '}
                  <NumberFormat
                    value={account.marketValue}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                  />
                </Item.Meta>
                <Item.Description>{account.description}</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment.Group>
      <div>Graph</div>
      <Positions positions={pos.getPositionsByAccountId} />
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
      <TransactionList transactions={trans.getTransactionsByAccountId} />
    </>
  );
};

export default AccountDetail;

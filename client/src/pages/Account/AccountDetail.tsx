import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Label, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

import Positions from '../Position/Positions';
import TransactionList from '../Transaction/TransactionList';
import { AccountProps } from './types/Account';

const AccountDetail = (props: AccountProps) => {
  const [account] = useState(props.location.state.account);

  console.log('[ACCOUNT DETAIL] Account: ', account);

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
      <Positions aggregateId={account.aggregateId} />
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
      <TransactionList aggregateId={account.aggregateId} />
    </>
  );
};

export default AccountDetail;

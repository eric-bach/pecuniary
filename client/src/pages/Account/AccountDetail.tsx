import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Label, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

const AccountDetail = (props: any) => {
  const [account] = useState(props.location.state.account);

  console.log('[ACCOUNT DETAIL] Account: ', account);

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
      <div>Positions</div>
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
      <div>Transactions</div>
    </>
  );
};

export default AccountDetail;

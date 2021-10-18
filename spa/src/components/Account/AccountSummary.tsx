import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Segment, Item, Button, Label } from 'semantic-ui-react';

import AccountReadModel from './types/Account';

const AccountSummary = (account: AccountReadModel) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Label as='span' color={`${account.accountType.name === 'RRSP' ? 'red' : 'blue'}`} ribbon>
            {account.accountType.name}
          </Label>
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
                <NumberFormat value={account.marketValue} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </Item.Meta>
              <Item.Description>
                {account.description}
                <Button
                  as='a'
                  color='red'
                  floated='right'
                  // onClick={() => deleteAccount(account)}
                  content='Delete'
                  data-test='delete-account-button'
                />
                <Button
                  as={Link}
                  to={`/accounts/edit/${account.aggregateId}`}
                  color='blue'
                  floated='right'
                  content='Edit'
                  data-test='edit-account-button'
                />
                <Button
                  as={Link}
                  to={{
                    pathname: `/accounts/view/${account.aggregateId}`,
                    state: {
                      account: account,
                    },
                  }}
                  color='teal'
                  floated='right'
                  content='View'
                  data-test='view-account-button'
                />
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Segment.Group>
  );
};

export default AccountSummary;

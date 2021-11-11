import { useState } from 'react';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Segment, Item, Button, Label, Message } from 'semantic-ui-react';
import { useMutation, gql } from '@apollo/client';

import AccountReadModel from './types/Account';

const deleteAccount = gql`
  mutation DeleteAccount($deleteAccountInput: CreateEventInput!) {
    createEvent(event: $deleteAccountInput) {
      id
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

const AccountSummary = (account: AccountReadModel) => {
  const [visible, setVisible] = useState(false);
  const [deleteAccountMutation] = useMutation(deleteAccount);

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleDeleteAccount = (account: AccountReadModel) => {
    console.log('[ACCOUNT SUMMARY] Deleting Account: ', account.aggregateId);

    const params = {
      deleteAccountInput: {
        aggregateId: account.aggregateId,
        name: 'AccountDeletedEvent',
        data: `{"id":"${account.id}"}`,
        version: account.version + 1,
        userId: account.userId,
        createdAt: new Date(),
      },
    };
    deleteAccountMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[ACCOUNT SUMMARY] Account deleted successfully');
        setVisible(true);
      })
      .catch((err) => {
        console.error('[ACCOUNT SUMMARY] Error occurred deleting account');
        console.error(err);
      });
  };

  return (
    <>
      {visible && (
        <Message
          positive
          onDismiss={handleDismiss}
          header='Deleting account'
          content='Account successfully deleted.  Please wait for changes to appear.'
        />
      )}
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
                  <NumberFormat
                    value={account.marketValue}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                  />
                </Item.Meta>
                <Item.Description>
                  {account.description}
                  <Button
                    as='a'
                    color='red'
                    floated='right'
                    onClick={() => handleDeleteAccount(account)}
                    content='Delete'
                    data-test='delete-account-button'
                  />
                  <Button
                    as={Link}
                    to={{
                      pathname: `/accounts/edit/${account.aggregateId}`,
                      state: {
                        account: account,
                      },
                    }}
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
    </>
  );
};

export default AccountSummary;

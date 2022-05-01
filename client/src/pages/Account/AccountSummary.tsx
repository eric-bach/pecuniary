import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Button, Label, Message } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import NumberFormat from 'react-number-format';
import { relative } from 'path';

import { DELETE_ACCOUNT } from './graphql/graphql';
import { AccountReadModel, DeleteAccountInput } from './types/Account';

const AccountSummary = (account: AccountReadModel) => {
  const [displayDeleteMessage, setMessageVisibility] = useState(false);
  const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);

  const handleDismiss = () => {
    setMessageVisibility(false);
  };

  const handleDeleteAccount = (account: AccountReadModel) => {
    console.log('[ACCOUNT SUMMARY] Deleting Account: ', account.aggregateId);

    const params: DeleteAccountInput = {
      deleteAccountInput: {
        userId: account.userId,
        aggregateId: account.aggregateId,
      },
    };
    deleteAccountMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[ACCOUNT SUMMARY] Account deleted successfully');
        setMessageVisibility(true);
      })
      .catch((err) => {
        console.error('[ACCOUNT SUMMARY] Error occurred deleting account');
        console.error(err);
      });
  };

  return (
    <>
      {displayDeleteMessage && (
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
            <Label as='span' color={`${account.type === 'RRSP' ? 'red' : 'blue'}`} ribbon>
              {account.type}
            </Label>
            <Item>
              <Item.Content>
                <Item.Header>
                  <div>{account.name}</div>
                </Item.Header>

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

                <Item.Description>{account.description}</Item.Description>
                <Item.Extra style={{ position: relative, top: '-100%' }}>
                  <Button floated='right' icon='delete' onClick={() => handleDeleteAccount(account)} />
                  <Button
                    floated='right'
                    icon='edit'
                    as={Link}
                    to={{
                      pathname: `/accounts/edit/${account.aggregateId}`,
                      state: {
                        account: account,
                      },
                    }}
                  />
                  <Button
                    floated='right'
                    icon='file alternate outline'
                    as={Link}
                    to={{
                      pathname: `/accounts/view/${account.aggregateId}`,
                      state: {
                        account: account,
                      },
                    }}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment.Group>
    </>
  );
};

export default AccountSummary;

import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Typography from '@mui/material/Typography';

import { AccountReadModel, DeleteAccountInput } from './types/Account';

const AccountSummary = ({ client, account }: any) => {
  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountBalanceIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={account.name}
            secondary={
              <>
                <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                  {account.type}
                </Typography>
                {` - ${account.description}`}
              </>
            }
          />
        </ListItem>
      </List>
    </>
  );
};

export default AccountSummary;

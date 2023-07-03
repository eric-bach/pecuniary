import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Typography from '@mui/material/Typography';

const AccountSummary = ({ account }: any) => {
  const link = `/app/accounts/${account.aggregateId}`;

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
        <ListItemButton component={Link} to={{ pathname: link, state: { account } }}>
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
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default AccountSummary;

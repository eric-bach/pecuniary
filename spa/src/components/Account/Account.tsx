import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);

  const fetchAccounts = async () => {
    try {
      let response = await fetch('https://randomuser.me/api');
      let json = await response.json();

      return { success: true, data: json };
    } catch (error) {
      console.error(error);

      return { success: false };
    }
  };

  useEffect(() => {
    (async () => {
      setAccountsLoaded(false);
      let res = await fetchAccounts();
      if (res.success) {
        setAccounts(res.data.results[0]);
        setAccountsLoaded(true);
      }
    })();
  }, []);

  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>
          {/* Accounts ({accounts.length})         */}
          Accounts 1
          <Button
            as={Link}
            to='/accounts/new'
            floated='right'
            positive
            content='Create Account'
            data-test='create-account-button'
          />
        </h2>
      </Grid.Column>
    </Grid>
  );
};

export default Account;

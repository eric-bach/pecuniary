//https://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import { useMutation, useQuery, gql } from '@apollo/client';

// TODO Figure out how to set Data as a JSON
const createAccount = gql`
  mutation CreateAccount {
    createEvent(
      event: {
        aggregateId: "1"
        name: "AccountCreatedEvent"
        version: 1
        data: "Test"
        userId: "eric"
        createdAt: "2020-02-18T00:00:00Z"
      }
    ) {
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
const listEvents = gql`
  query ListEvents {
    listEvents {
      id
    }
  }
`;

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);

  const [createAccountMutation] = useMutation(createAccount);
  //const [queryEvents] = useQuery(listEvents);

  const handleCreateTodoClick = () => {
    createAccountMutation()
      .then((res: any) => console.log('Created Account successfully'))
      .catch((err: any) => {
        console.log('Error occurred');
        console.log(err);
      });
  };

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
      handleCreateTodoClick();
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

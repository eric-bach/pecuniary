//https://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import { useQuery, gql } from '@apollo/client';

import { UserContext } from '../Auth/User';
import AccountReadModel from './types/Account';
import AccountSummary from './AccountSummary';

const getAccountsByUser = gql`
  query getAccountsByUser($userId: String!) {
    getAccountsByUser(userId: $userId) {
      id
      aggregateId
      version
      name
      description
      bookValue
      marketValue
      userId
      createdAt
      updatedAt
      accountType {
        id
        name
        description
      }
    }
  }
`;

const Accounts = () => {
  const [userId, setUserId] = useState('');
  const { data, error, loading } = useQuery(getAccountsByUser, { variables: { userId: userId } });
  const { getSession } = useContext(UserContext);

  useEffect(() => {
    // Get the logged in username
    getSession().then((session: any) => {
      setUserId(session.idToken.payload.email);
    });
  });

  // TODO Improve these loading screens
  if (error) return 'Error!'; // You probably want to do more here!
  if (loading) return 'Loading...'; // You can also show a spinner here.

  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>
          Accounts ({data.getAccountsByUser.length})
          <Button
            as={Link}
            to='/accounts/new'
            floated='right'
            positive
            content='Create Account'
            data-test='create-account-button'
          />
        </h2>

        <Button.Group>
          <Button labelPosition='left' icon='left chevron' content='Previous' />
          <Button labelPosition='right' icon='right chevron' content='Next' />
        </Button.Group>

        {data &&
          data.getAccountsByUser.map((d: AccountReadModel) => {
            return <AccountSummary key={d.id} {...d} />;
          })}
      </Grid.Column>
      <Grid.Column width={5}>
        <h2>Summary</h2>
        {/* <Doughnut data={data} /> */}
      </Grid.Column>
    </Grid>
  );
};

export default Accounts;

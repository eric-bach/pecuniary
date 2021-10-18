//https://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/
import { Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import { useQuery, gql } from '@apollo/client';

/*
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
*/
const getAccountsByUser = gql`
  query getAccountsByUser {
    getAccountsByUser(userId: "eric") {
      id
      aggregateId
      name
      description
      bookValue
      marketValue
      createdAt
      updatedAt
    }
  }
`;

interface AccountReadModel {
  id: string;
  aggregateId: string;
  name: string;
  description: string;
  bookValue: number;
  marketValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const Accounts = () => {
  // const [accounts, setAccounts] = useState([]);
  // const [accountsLoaded, setAccountsLoaded] = useState(false);

  //const [createAccountMutation] = useMutation(createAccount);
  const { data, error, loading } = useQuery(getAccountsByUser);

  if (error) return 'Error!'; // You probably want to do more here!
  if (loading) return 'loading...'; // You can also show a spinner here.

  /* 
   * EXAMPLE: Calling GraphQL Mutation with hooks
  const handleCreateTodoClick = () => {
        const todo = {
          item: 'visit qualityology.com'
        }
        createTodoMutation({
            variables: todo,
        })
            .then((res) => console.log('Todo created successfully'))
            .catch((err) => {
                console.log('Error occurred');
                console.log(err);
            });
    };
  */

  /*
   * EXAMPLE: Calling an API with hooks
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
  */

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
            return (
              <div>
                {d.id} {d.name} {d.description} ${d.bookValue}
              </div>
            );
          })}
      </Grid.Column>
    </Grid>
  );
};

export default Accounts;

# How-to make authenticated GraphQL API calls with the Apollo client

1. Install the required packages

   ```
   $ npm install @apollo/client aws-appsync-auth-link graphql
   ```

2. Create `aws-exports.js` with the values from your AWS resources. This is normally automatically created by amplify but we are not using amplify and need to create this manually.

   ```
   /* eslint-disable */
   const awsmobile = {
    aws_project_region: '{REPLACE_ME}',
    aws_cognito_region: '{REPLACE_ME}',
    aws_user_pools_id: '{REPLACE_ME}',
    aws_user_pools_web_client_id: '{REPLACE_ME}',

    aws_appsync_graphqlEndpoint: '{REPLACE_ME}',
    aws_appsync_region: '{REPLACE_ME}',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
   };

   export default awsmobile;
   ```

3. Create `client.js` with the following code. The client currently reads the jwtToken from localStorage (read this from the session in the future).

   ```
   import { createAuthLink } from 'aws-appsync-auth-link';
   import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
   import { ApolloLink, createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

   import AppSyncConfig from './aws-exports';

   const url = AppSyncConfig.aws_appsync_graphqlEndpoint;
   const region = AppSyncConfig.aws_project_region;
   const auth = {
   type: AppSyncConfig.aws_appsync_authenticationType,
       jwtToken: localStorage.getItem('accessToken'),
   };

   const link = ApolloLink.from([
   createAuthLink({ url, region, auth }),
   createSubscriptionHandshakeLink({ url, region, auth }, createHttpLink({ uri: url })),
   ]);

   const client = new ApolloClient({ link, cache: new InMemoryCache() });

   export default client;
   ```

4. Modify `index.tsx` to make the Apollo client accessible.

   ```
   import { ApolloProvider } from '@apollo/client';
   import client from './client';

   <ApolloProvider client={client}>
       <App />
   </ApolloProvider>,
   ```

## Making a GraphQL query

https://www.yannisspyrou.com/querying-app-sync-using-react-hooks

1.  Create a GraphQL query

    ```
    import {  gql } from '@apollo/client';

    const GET_ACCOUNTS = gql`
    query GetAccountsByUser($userId: String!) {
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
    ```

2.  Add the `useQuery` hook to the functional component

    ```
    import { useQuery, gql } from '@apollo/client';

    const ListAccounts = () => {
        const { data, error, loading } = useQuery(GET_ACCOUNTS, { variables: { userId: userId } });

        if (error) return <div>Error!</div>;
        if (loading) return <div>Loading...</div>

        return (
            <ul>
            {data &&
                data.getAccountsByUser.map(account => {
                return (
                    <Account key={account.id} name={account.name} desc={account.description} />
                );
                })}
            </ul>
        );
    };
    ```

## Making a GraphQL mutation

https://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/

1. Create a GraphQL mutation

   ```
   import {  gql } from '@apollo/client';

   const CREATE_ACCOUNT = gql`
       mutation CreateAccount($createAccountInput: CreateEventInput!) {
           createEvent(event: $createAccountInput) {
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
   ```

2. Add the `useMutation` hook to the functional component

   ```
   import { useMutation, gql } from '@apollo/client';

   const CreateAccount = () => {
      const [createAccountMutation] = useMutation(CREATE_ACCOUNT);

      if (error) return <div>Error!</div>;
      if (loading) return <div>Loading...</div>
   }
   ```

3. Call the mutation

   ```
   const params = {
       createAccountInput: {
         aggregateId: uuidv4(),
         name: 'AccountCreatedEvent',
         data: `{"name":"${name}","description":"${description}","bookValue":0,"marketValue":0,"accountType":{"id":"${selectedAccountType.key}","name":"${selectedAccountType.text}","description":"${selectedAccountType.value}"}}`,
         version: 1,
         userId: `${username}`,
         createdAt: new Date(),
       },
    };

    createAccountMutation({
       variables: params,
    })
       .then((res) => {
         console.log('Account created successfully');
       })
       .catch((err) => {
         console.error('Error occurred creating account');
         console.error(err);
       });
   ```

## Making a GraphQL subscription

https://www.youtube.com/watch?v=Bf3k7zH0I6w

1. Create a GraphQL subscription

   ```
   import { gql } from '@apollo/client';

   const ACCOUNT_SUBSCRIPTION = gql`
    subscription OnCreateEvent {
        onCreateEvent {
        id
        name
        aggregateId
        version
        data
        userId
        createdAt
        }
    }
   `;
   ```

2. Add the `useSubscription` hook to the functional component

   ```
   import { useSubscription, gql } from '@apollo/client';

   const SubscribeToAccount = () => {
       const { data, loading, error } = useSubscription(ACCOUNT_SUBSCRIPTION);

       if (error) return <div>Error!</div>;
       if (loading) return <div>Loading...</div>

       return (
           <div>
            <h1>New Account Created</h1>
            <p>Id: {data.id}</p>
            <p>Name: {data.name}</p>
           </div>
       )
   };
   ```

3. When a mutation is created this component will re-render with the newly added event

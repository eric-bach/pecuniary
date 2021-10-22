# How-to add a new GraphQL API and Command Handler

1.  Update the AppSync GraphQL schema file (cdk/lib/graphql/schema.graphql) to add the GraphQL query, mutation, or subscription

    This example adds the `getAccountsByUser` query returning a list of `AccountReadModel`. The query is restricted to Cognito users in the `Users` group.

    ```
    type Query {
        getAccountsByUser(userId: String!): [AccountReadModel] @aws_cognito_user_pools(cognito_groups: ["Users"])
    }
    ```

2.  Create a new file in the commandHandler lambda (/cdk/lib/graphql/lambda/commandHandler/) that will contain the AppSync resolver code to interact with DynamoDB.

    ```
    // See getAccountsByUser.ts
    ```

3.  Update the `AppSyncEvent` object as necessary for any additional properties that are required by the resolver. For example, adding `userId` as an argument for `getAccountsByUser` to filter by the userId field in DynamoDB.

    ```
    type AppSyncEvent = {
        arguments: {
            ...
            userId: string;
        };
    };
    ```

4.  Add an entry in the switch statement of the Command Handler lambda (/cdk/lib/graphql/lambda/commandHandler/main.ts) to call the resolver code.

    ```
    switch (event.info.fieldName) {
        case 'getAccountsByUser':
            console.debug(`🔔 GetAccountsByUser: ${JSON.stringify(event.arguments.userId)}`);
            return await getAccountsByUser(event.arguments.userId);
    ```

5.  Add a resolver to the CDK stack (/cdk/lib/pecuniary-stack.ts)

    ```
    lambdaDataSource.createResolver({
        typeName: 'Query',
        fieldName: 'getAccountsByUser',
    });
    ```

6.  Test in AppSync query console or call AppSync API from UI.

    ```
    query GetAccounts {
        getAccountsByUser(userId: "eric") {
            id
        }
    }
    ```

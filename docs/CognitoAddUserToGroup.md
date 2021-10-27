# How-to add a user to a Cognito User Group

In order to add a user to a Cognito User Group, AWS developer credentials are required. See the AWS documentation for reference - https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminAddUserToGroup.html

For this, we will create an AppSync GraphQL API to call from our React client during sign up.

Reference this documentation - https://bobbyhadz.com/blog/aws-cognito-add-user-to-group

1.  Update the graphQL schema `./backend/lib/graphql/schema.graphql` to add a mutation to invoke the lambda function that will add the user to the Cognito User Group

        ```
        input AddUserToCognitoGroupInput @aws_cognito_user_pools {
            userPoolId: String!
            username: String!
            groupName: String!
        }

        type AddUserToCognitoGroupResult @aws_cognito_user_pools {
            error: String
        }

        addUserToCognitoGroup(cognito: AddUserToCognitoGroupInput!): AddUserToCognitoGroupResult  @aws_cognito_user_pools
        ```

2.  Create a new file in the commandHandler lambda (`./backend/lib/graphql/lambda/commandHandler/`) that will contain the AppSync resolver code to interact with DynamoDB.

    ```
    import * as AWS from 'aws-sdk';
    import Cognito from './types/Cognito';

    async function addUserToCognitoGroup(cognito: Cognito): Promise<{$response: AWS.Response<Record<string, string>, AWS.AWSError>;}> {
        console.log('Received Cognito event: ', cognito);

        const params = {
            GroupName: cognito.groupName,
            UserPoolId: cognito.userPoolId,
            Username: cognito.username,
        };

        const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
        var result = cognitoIdp.adminAddUserToGroup(params).promise();

        console.log(`✅ Successfully added user ${cognito.username} to cognito group ${cognito.groupName}`);

        return result;
    }

    export default addUserToCognitoGroup;
    ```

3.  Update the `AppSyncEvent` object as necessary for any additional properties that are required by the resolver. For example, adding `cognito` as an input for the `addUserToCognitoGroup` mutation.

    ```
    type AppSyncEvent = {
        input: {
            ...
            cognito: Cognito; //addUserToCognitoGroup
        };
    };
    ```

4.  Add an entry in the switch statement of the Command Handler lambda (/cdk/lib/graphql/lambda/commandHandler/main.ts) to call the resolver code.

    ```
    switch (event.info.fieldName) {
        case 'addUserToCognitoGroup':
            console.debug(`🔔 Adding user to Cognito group`);
            return await addUserToCognitoGroup(event.arguments.cognito);
    ```

5.  Add a resolver to the CDK stack (/cdk/lib/pecuniary-stack.ts)

    ```
    lambdaDataSource.createResolver({
        typeName: 'Mutation',
        fieldName: 'addUserToCognitoGroup',
    });
    ```

6.  Test in AppSync query console or call AppSync API from UI.

    ```
    mutation addUserToGroup {
        addUserToCognitoGroup(cognito: {
            userPoolId: "{USER_POOL_ID}"
            username: "{USERNAME}"
            groupName: "Users"
        })
        {
            error
        }
    }
    ```

7.  Update the React client to call the AppSync mutation

    ```
    TO BE ADDED...
    ```

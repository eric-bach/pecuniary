# How-to add a user to a Cognito User Group

In order to add a user to a Cognito User Group, AWS developer credentials are required. See the AWS documentation for reference - https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminAddUserToGroup.html

For this, we will create an AppSync GraphQL API to call from our React client during sign up.

Reference this documentation - https://bobbyhadz.com/blog/aws-cognito-add-user-to-group

1.  Create a lambda function

    ```
    import {Callback, Context, PostConfirmationTriggerEvent} from 'aws-lambda';
    import AWS from 'aws-sdk';

    export async function main(
    event: PostConfirmationTriggerEvent,
    _context: Context,
    callback: Callback,
    ): Promise<void> {
    const {userPoolId, userName} = event;

    try {
        await adminAddUserToGroup({
        userPoolId,
        username: userName,
        groupName: 'Users',
        });

        return callback(null, event);
    } catch (error) {
        return callback(error, event);
    }
    }

    export function adminAddUserToGroup({
    userPoolId,
    username,
    groupName,
    }: {
    userPoolId: string;
    username: string;
    groupName: string;
    }): Promise<{
    $response: AWS.Response<Record<string, string>, AWS.AWSError>;
    }> {
    const params = {
        GroupName: groupName,
        UserPoolId: userPoolId,
        Username: username,
    };

    const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
    return cognitoIdp.adminAddUserToGroup(params).promise();
    }
    ```

2.  Add permission in the CDK stack

    ```
    const cognitoHandlerFunction = new Function(this, 'CognitoHandler', {
      runtime: Runtime.NODEJS_14_X,
      functionName: `${props.appName}-cognitoHandler`,
      handler: 'main.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda', 'cognitoHandler')),
      memorySize: 256,
      timeout: Duration.seconds(10),
      environment: {
        REGION: REGION,
      },
    });

    // Cognito user pool
    const userPool = new UserPool(this, 'PecuniaryUserPool', {
     ...
      lambdaTriggers: {
        postConfirmation: cognitoHandlerFunction,
      },
    });

    // Add permissions to add user to Cognito User Pool
    cognitoHandlerFunction.role!.attachInlinePolicy(
      new Policy(this, 'userpool-policy', {
        statements: [
          new PolicyStatement({
            actions: ['cognito-idp:AdminAddUserToGroup'],
            resources: [userPool.userPoolArn],
          }),
        ],
      })
    );

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

# Examples

Additional AppSync GraphQL resolvers

To use these resolvers

    1. Add the necessary schema and query/mutation to the AppSync GraphQL schema file (cdk/lib/graphql/schema.graphql)

    2. Copy these resolvers to the /cdk/lib/graphql/lambda/commandHandler folder

    3. Update the switch statement in /cdk/lib/graphql/lambda/commandHandler/main.ts to handle this new resolver

    3. Add a resolver to the CDK stack /cdk/lib/pecuniary-stack.ts
        lambdaDataSource.createResolver({
          typeName: 'Mutation',
            fieldName: 'createEvent',
        });

        lambdaDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'listEvents',
        });

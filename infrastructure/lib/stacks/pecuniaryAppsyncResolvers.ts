import { Construct } from 'constructs';
import { AppsyncResolver } from '../constructs/appsyncResolver';
import { PecuniaryAppsyncResolversProps } from '../types/PecuniaryStackProps';
import { Code } from 'aws-cdk-lib/aws-appsync';
import * as path from 'path';

export class PecuniaryAppsyncResolvers extends Construct {
  constructor(scope: Construct, id: string, props: PecuniaryAppsyncResolversProps) {
    super(scope, id);

    const { api, dataSources } = props;

    const getAggregateResolver = new AppsyncResolver(this, 'getAggregate', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'getAggregate',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Query.getAggregate.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    const publishEventResolver = new AppsyncResolver(this, 'publishEvent', {
      api,
      dataSource: dataSources.eventBridge,
      name: 'publishEvent',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Event.publishEvent.js')),
      },
    });

    new AppsyncResolver(this, 'createAccount', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'createAccount',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.createAccount.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    new AppsyncResolver(this, 'updateAccount', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'updateAccount',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.updateAccount.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    new AppsyncResolver(this, 'deleteAccount', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'deleteAccount',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.deleteAccount.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: { pre: [getAggregateResolver.function] },
      },
    });

    new AppsyncResolver(this, 'getAccount', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'getAccount',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Query.getAccount.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    new AppsyncResolver(this, 'getAccounts', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'getAccounts',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Query.getAccounts.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    new AppsyncResolver(this, 'getBankTransactions', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'getBankTransactions',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Query.getBankTransactions.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    new AppsyncResolver(this, 'getInvestmentTransactions', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'getInvestmentTransactions',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Query.getInvestmentTransactions.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    new AppsyncResolver(this, 'createCategory', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'createCategory',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.createCategory.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    new AppsyncResolver(this, 'updateCategory', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'updateCategory',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.updateCategory.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    new AppsyncResolver(this, 'getCategories', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'getCategories',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Query.getCategories.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    new AppsyncResolver(this, 'createPayee', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'createPayee',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.createPayee.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    new AppsyncResolver(this, 'updatePayee', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'updatePayee',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.updatePayee.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    new AppsyncResolver(this, 'getPayees', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'getPayees',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Query.getPayees.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    new AppsyncResolver(this, 'createSymbol', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'createSymbol',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.createSymbol.js')),
      },
      resolver: {
        typeName: 'Mutation',
      },
    });

    new AppsyncResolver(this, 'getSymbols', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'getSymbols',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Query.getSymbols.js')),
      },
      resolver: {
        typeName: 'Query',
      },
    });

    new AppsyncResolver(this, 'createBankTransaction', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'createBankTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.createBankTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    new AppsyncResolver(this, 'updateBankTransaction', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'updateBankTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.updateBankTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    new AppsyncResolver(this, 'deleteBankTransaction', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'deleteBankTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.deleteBankTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    new AppsyncResolver(this, 'createInvestmentTransaction', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'createInvestmentTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.createInvestmentTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    new AppsyncResolver(this, 'updateInvestmentTransaction', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'updateInvestmentTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.updateInvestmentTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });

    new AppsyncResolver(this, 'deleteInvestmentTransaction', {
      api,
      dataSource: dataSources.dynamoDb,
      name: 'deleteInvestmentTransaction',
      function: {
        code: Code.fromAsset(path.join(__dirname, '../../../backend/appsync/build/Mutation.deleteInvestmentTransaction.js')),
      },
      resolver: {
        typeName: 'Mutation',
        pipelineConfig: {
          post: [publishEventResolver.function],
        },
      },
    });
  }
}

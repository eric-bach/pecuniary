import { StackProps } from 'aws-cdk-lib';
import { BaseDataSource, Code, GraphqlApi, IAppsyncFunction } from 'aws-cdk-lib/aws-appsync';

export interface PecuniaryBaseStackProps extends StackProps {
  appName: string;
  envName: string;
}

export interface PecuniaryObservabilityStackProps extends PecuniaryBaseStackProps {
  params: {
    dlqNotifications: string;
  };
}

export interface PecuniaryApiStackProps extends PecuniaryBaseStackProps {
  params: {
    userPoolId: string;
    dataTableArn: string;
    updateBankAccountDlqArn: string;
    updateInvestmentAccountDlqArn: string;
  };
}

export interface PecuniaryAppsyncResolversProps {
  api: GraphqlApi;
  dataSources: {
    dynamoDb: BaseDataSource;
    eventBridge: BaseDataSource;
  };
}

export interface AppsyncResolverProps {
  api: GraphqlApi;
  dataSource: BaseDataSource;
  name: string;
  function: {
    code: Code;
  };
  resolver?: {
    typeName: string;
    pipelineConfig?: { pre?: IAppsyncFunction[]; post?: IAppsyncFunction[] };
  };
}

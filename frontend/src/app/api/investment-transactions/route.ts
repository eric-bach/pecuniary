import { serverClient } from '@/utils/amplifyServerUtils';
import { getInvestmentTransactions } from '../../../../../backend/src/appsync/api/queries';
import { InvestmentTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const accountId = searchParams.get('accountId') ?? '';

  const { data } = await serverClient.graphql({
    query: getInvestmentTransactions,
    variables: {
      accountId,
    },
  });

  return Response.json(data.getInvestmentTransactions as [InvestmentTransaction]);
}

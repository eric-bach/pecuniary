import { serverClient } from '@/utils/amplifyServerUtils';
import { getInvestmentTransactions } from '@/actions/api/queries';
import { InvestmentTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const accountId = searchParams.get('accountId') ?? '';

  const result = (await serverClient.graphql({
    query: getInvestmentTransactions,
    variables: {
      accountId,
    },
  })) as { data: { getInvestmentTransactions: [InvestmentTransaction] } };

  const { data } = result;

  return Response.json(data.getInvestmentTransactions as [InvestmentTransaction]);
}

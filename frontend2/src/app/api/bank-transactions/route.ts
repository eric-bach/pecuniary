import { serverClient } from '@/utils/amplifyServerUtils';
import { getBankTransactions } from '@/actions/api/queries';
import { BankTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const accountId = searchParams.get('accountId') ?? '';

  const result = (await serverClient.graphql({
    query: getBankTransactions,
    variables: {
      accountId,
    },
  })) as { data: { getBankTransactions: [BankTransaction] } };

  const { data } = result;

  return Response.json(data.getBankTransactions as [BankTransaction]);
}

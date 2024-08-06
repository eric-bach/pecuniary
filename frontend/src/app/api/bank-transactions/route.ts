import { serverClient } from '@/utils/amplifyServerUtils';
import { getBankTransactions } from '../../../../../backend/src/appsync/api/queries';
import { BankTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const accountId = searchParams.get('accountId') ?? '';

  const { data } = await serverClient.graphql({
    query: getBankTransactions,
    variables: {
      accountId,
    },
  });

  return Response.json(data.getBankTransactions as [BankTransaction]);
}
